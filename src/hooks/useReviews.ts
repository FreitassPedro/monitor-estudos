import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localDb } from '@/lib/localDb';
import type { Review, ReviewCycle, NewReviewData } from '@/types/reviews';
import { addDays, formatISO, parseISO, differenceInDays } from 'date-fns';

const REVIEWS_TABLE = 'reviews';
const BASE_CYCLE_DAYS = [3, 10, 30, 90]; // R1, R2, R3, R4

// --- Helper Functions ---

const getInitialCycleDates = (startDate: Date): ReviewCycle[] => {
  return BASE_CYCLE_DAYS.map((days, index) => ({
    cycle: index + 1,
    plannedDate: formatISO(addDays(startDate, days)),
    isCompleted: false,
  }));
};

const getRescheduledCycles = (
  originalCycles: ReviewCycle[], 
  completedCycle: ReviewCycle, 
  performance: number
): ReviewCycle[] => {
  const completionDate = new Date(); // Reschedule based on today's date
  let needsRescheduling = true;

  return originalCycles.map(cycle => {
    // Return cycles that are already completed as they are
    if (cycle.cycle <= completedCycle.cycle) {
      if(cycle.cycle === completedCycle.cycle){
        return { ...cycle, isCompleted: true, performance, comments: completedCycle.comments };
      }
      return cycle;
    }

    // For future cycles, reschedule if needed
    if (needsRescheduling) {
      const originalInterval = differenceInDays(
        parseISO(cycle.plannedDate),
        parseISO(originalCycles[cycle.cycle - 2]?.plannedDate ?? new Date()) // a bit complex
      );

      let newInterval = originalInterval;
      if (performance < 50) {
        newInterval = Math.ceil(originalInterval * 0.5); // Halve the interval
      } else if (performance < 75) {
        newInterval = Math.ceil(originalInterval * 0.75); // Reduce by 25%
      } else {
        needsRescheduling = false; // Performance is good, stop rescheduling subsequent cycles
      }
      
      const previousCycleCompletionDate = completionDate;
      const newPlannedDate = addDays(previousCycleCompletionDate, newInterval);

      return {
        ...cycle,
        plannedDate: formatISO(newPlannedDate)
      };
    }
    
    return cycle;
  });
};


// --- Hooks ---

export function useReviews() {
  return useQuery({
    queryKey: [REVIEWS_TABLE],
    queryFn: () => localDb.getAll<Review>(REVIEWS_TABLE),
    initialData: () => localDb.getAll<Review>(REVIEWS_TABLE),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newReviewData: NewReviewData) => {
      const today = new Date();
      const reviewToInsert = {
        ...newReviewData,
        createdAt: formatISO(today),
        cycles: getInitialCycleDates(today),
        id: window.crypto.randomUUID(),
      };
      const reviews = localDb.getAll<Review>(REVIEWS_TABLE);
      reviews.push(reviewToInsert);
      localStorage.setItem(REVIEWS_TABLE, JSON.stringify(reviews));
      return reviewToInsert;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REVIEWS_TABLE] });
    },
  });
}


export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ review, completedCycle, performance }: { review: Review; completedCycle: ReviewCycle, performance: number }) => {
      
      const updatedCycles = getRescheduledCycles(review.cycles, completedCycle, performance);
      const updatedReview = { ...review, cycles: updatedCycles };
      
      return localDb.update<Review>(REVIEWS_TABLE, review.id, updatedReview);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REVIEWS_TABLE] });
    },
  });
}

export function useUpdateReviewDetails() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedReview: Partial<Review> & { id: string }) => {
      return localDb.update<Review>(REVIEWS_TABLE, updatedReview.id, updatedReview);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REVIEWS_TABLE] });
    },
  });
}

export function useUpdateCycle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, updatedCycle }: { reviewId: string, updatedCycle: ReviewCycle }) => {
      const reviews = localDb.getAll<Review>(REVIEWS_TABLE);
      const reviewIndex = reviews.findIndex(r => r.id === reviewId);
      if (reviewIndex === -1) throw new Error('Review not found');

      const review = reviews[reviewIndex];
      const cycleIndex = review.cycles.findIndex(c => c.cycle === updatedCycle.cycle);
      if (cycleIndex === -1) throw new Error('Cycle not found');

      // Create a new cycles array with the updated cycle
      const updatedCycles = [
        ...review.cycles.slice(0, cycleIndex),
        updatedCycle,
        ...review.cycles.slice(cycleIndex + 1)
      ];
      
      const updatedReview = { ...review, cycles: updatedCycles };

      // Replace the old review with the updated one
      const updatedReviews = [
        ...reviews.slice(0, reviewIndex),
        updatedReview,
        ...reviews.slice(reviewIndex + 1)
      ];

      localStorage.setItem(REVIEWS_TABLE, JSON.stringify(updatedReviews));
      return updatedReview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REVIEWS_TABLE] });
    },
  });
}


export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      localDb.delete(REVIEWS_TABLE, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REVIEWS_TABLE] });
    },
  });
}