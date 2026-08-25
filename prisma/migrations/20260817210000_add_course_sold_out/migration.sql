-- Marca una edición como agotada o ya celebrada. El curso sigue visible en el
-- catálogo (prueba social y anclaje de precio) pero no se puede comprar.
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "soldOut" BOOLEAN NOT NULL DEFAULT false;
