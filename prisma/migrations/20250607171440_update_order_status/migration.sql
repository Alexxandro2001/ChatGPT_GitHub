-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'In elaborazione',
    "shippingAddress" TEXT,
    "shippingCity" TEXT,
    "shippingPostCode" TEXT,
    "shippingCountry" TEXT,
    "paymentMethod" TEXT,
    "paymentStatus" TEXT DEFAULT 'pending',
    "total" REAL NOT NULL,
    "stripePaymentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("createdAt", "id", "isDeleted", "paymentMethod", "paymentStatus", "shippingAddress", "shippingCity", "shippingCountry", "shippingPostCode", "status", "stripePaymentId", "total", "updatedAt", "userId") SELECT "createdAt", "id", "isDeleted", "paymentMethod", "paymentStatus", "shippingAddress", "shippingCity", "shippingCountry", "shippingPostCode", "status", "stripePaymentId", "total", "updatedAt", "userId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
