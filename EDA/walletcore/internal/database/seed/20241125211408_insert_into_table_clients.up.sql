INSERT
  IGNORE INTO clients (id, name, email, created_at, updated_at)
VALUES
  (
    "f35bf441-8376-4bd9-8d4d-0002612483d9",
    'John Doe',
    'john@example.com',
    NOW(),
    NOW()
  );

INSERT
  IGNORE INTO clients (id, name, email, created_at, updated_at)
VALUES
  (
    "a6b3fdb4-a45c-4696-add7-12b61499262c",
    ' Jane Doe ',
    ' jane @example.com ',
    NOW(),
    NOW()
  );