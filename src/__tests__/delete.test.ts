import { integer, text, timestamptz, uuid } from './../columns/dataTypes';

import { createDatabase } from '../database';
import { defineTable } from '../defines/table';

describe(`delete`, () => {
  const itemTable = defineTable({
    id: uuid()
      .primary()
      .notNull()
      .default(`gen_random_uuid()`),
    createdAt: timestamptz()
      .notNull()
      .default(`now()`),
    name: text().notNull(),
    value: integer(),
  });

  const db = createDatabase(process.env.DATABASE_URL!, {
    item: itemTable,
  });

  beforeEach(async () => {
    await db.sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;

    await db.sql`CREATE TABLE item (
      id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      name TEXT NOT NULL,
      value INTEGER
    )`;
  });

  afterEach(async () => {
    await db.sql`DROP TABLE item`;
  });

  afterAll(async () => {
    await db.destroy();
  });

  it(`should delete item using where clause`, async () => {
    const rows = await db
      .deleteFrom(db.item)
      .where(db.item.name.eq(`Test`))
      .returning(`name`);

    expect(rows).toHaveLength(0);
  });
});
