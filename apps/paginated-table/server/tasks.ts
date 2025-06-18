"use server";

export async function getTasks({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  const skip = (page - 1) * limit;
  const res = await fetch(`https://raw.githubusercontent.com/HaythemLazaar/ui-experiments/refs/heads/main/placeholders/tasks-01.json`);
  const data = await res.json();
  const pageData = data.slice(skip, skip + limit);
  const totalPages = Math.ceil(data.length / limit);
  return { data: pageData, total: data.length, totalPages };
}
