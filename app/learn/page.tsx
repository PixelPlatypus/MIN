import LearnPage from './learn-page-client';

async function fetchLearnData() {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/learn`;
  console.log('Fetching from:', url);
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`Failed to fetch learn data: ${res.status} ${res.statusText}`);
      throw new Error('Failed to fetch learn data');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching learn data:', error);
    throw error;
  }
}

export default async function LearnPageWrapper() {
  const { videoCourses, funSeries, resourcesData } = await fetchLearnData();

  const videoCategories = ["All", ...new Set<string>(videoCourses.map((course: any) => String(course.category)))];
  const resourceCategories = ["All", ...new Set<string>(resourcesData.map((resource: any) => String(resource.category)))];

  return (
    <LearnPage
      videoCourses={videoCourses}
      funSeries={funSeries}
      resourcesData={resourcesData}
      videoCategories={videoCategories}
      resourceCategories={resourceCategories}
    />
  );
}