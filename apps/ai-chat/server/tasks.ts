"use server";

export async function getTasks({
  page,
  limit,
  query,
}: {
  page: number;
  limit: number;
  query: string;
}) {
  const skip = (page - 1) * limit;
  const res = await fetch(`https://raw.githubusercontent.com/HaythemLazaar/ui-experiments/refs/heads/main/placeholders/tasks-01.json`);
  const data = await res.json();
  const filteredData = data.filter((task: { title: string }) =>
    task.title.toLowerCase().includes(query.toLowerCase())
  );
  const pageData = filteredData.slice(skip, skip + limit);
  const totalPages = Math.ceil(filteredData.length / limit);
  return { data: pageData, total: filteredData.length, totalPages };
}
