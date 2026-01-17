import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localDb } from '@/lib/localDb';
import type { Review, ReviewCycle, NewReviewData } from '@/types/reviews';
import { addDays, formatISO } from 'date-fns';

const REVIEWS_TABLE = 'reviews';

// Helper to calculate cycle dates
const getCycleDates = (startDate: Date): ReviewCycle[] => {
  const cycleDays = [3, 10, 30, 90]; // R1, R2, R3, R4
  return cycleDays.map((days, index) => ({
    cycle: index + 1,
    plannedDate: formatISO(addDays(startDate, days)),
    isCompleted: false,
  }));
};

// Hook to get all reviews
export function useReviews() {
  return useQuery({
    queryKey: [REVIEWS_TABLE],
    queryFn: () => {
      return localDb.getAll<Review>(REVIEWS_TABLE);
    },
    initialData: () => {
      return localDb.getAll<Review>(REVIEWS_TABLE);
    }
  });
}

// Hook to create a review
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newReviewData: NewReviewData) => {
      const today = new Date();
      const cycles = getCycleDates(today);
      
      const reviewToInsert = {
        ...newReviewData,
        createdAt: formatISO(today),
        cycles,
      };

      // The localDb.insert function in the project adds its own 'id' and 'created_at'.
      // We use a custom implementation here to match the Review type exactly.
      const reviews = localDb.getAll<Review>(REVIEWS_TABLE);
      const newReviewWithId = { ...reviewToInsert, id: window.crypto.randomUUID() };
      reviews.push(newReviewWithId);
      localStorage.setItem(REVIEWS_TABLE, JSON.stringify(reviews));
      
      return newReviewWithId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REVIEWS_TABLE] });
    },
  });
}

// Hook to update a review (e.g., complete a cycle)
export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedReview: Review) => {
      return localDb.update<Review>(REVIEWS_TABLE, updatedReview.id, updatedReview);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REVIEWS_TABLE] });
    },
  });
}
