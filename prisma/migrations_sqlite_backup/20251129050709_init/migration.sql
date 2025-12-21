-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quizId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "options" TEXT,
    "correctAnswer" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 1,
    "order" INTEGER NOT NULL,
    CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("correctAnswer", "id", "options", "order", "points", "question", "quizId", "type") SELECT "correctAnswer", "id", "options", "order", "points", "question", "quizId", "type" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
CREATE TABLE "new_QuizAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "answers" TEXT NOT NULL,
    "attemptedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_QuizAttempt" ("answers", "attemptedAt", "id", "passed", "quizId", "score", "userId") SELECT "answers", "attemptedAt", "id", "passed", "quizId", "score", "userId" FROM "QuizAttempt";
DROP TABLE "QuizAttempt";
ALTER TABLE "new_QuizAttempt" RENAME TO "QuizAttempt";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
