-- Tabela de Revisões
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  absorption_percentage INTEGER NOT NULL,
  review_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Política pública
CREATE POLICY "Allow all operations on reviews" ON public.reviews FOR ALL USING (true) WITH CHECK (true);
