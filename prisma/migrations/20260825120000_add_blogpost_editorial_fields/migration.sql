-- Campos editoriales del artículo: subtítulo y puntos clave de la barra lateral.
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "subtitle" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "keyPoints" JSONB;
