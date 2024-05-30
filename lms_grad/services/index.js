import { request, gql } from "graphql-request";

const MASTER_URL = "https://api-eu-west-2.hygraph.com/v2/clskpqlt63wpg01uplm4n0t71/master"

export const getCourseList = async () => {
  const query = gql`
    query CourseLists {
      courseLists {
        createdAt
        description
        free
        price
        id
        name
        publishedAt
        slug
        totalChapters
        updatedAt
        chapter {
          ... on Chapter {
            id
            name
            shortDesc
            video {
              id
              url
            }
          }
        }
        banner {
          id
          url
        }
        counterEnroll
        authorEmail
        tags
      }
    }
  `;

  const result = await request(MASTER_URL, query);
  return result;
};


export const enrollCourse = async (courseId, email) => {
  const courseQuery = gql`
    query MyQuery {
      courseList(where: {id: "${courseId}"}) {
        authorEmail
      }
    }
  `;
  const courseResult = await request(MASTER_URL, courseQuery);
  const authorEmail = courseResult.courseList.authorEmail;

  // Kullaniciyi kursa kaydet
  const dateEnroll = new Date().toISOString();
  const enrollQuery = gql`
    mutation MyMutation {
      createUserEnrollCourse(
        data: {courseId:"${courseId}", userEmail:"${email}", authorEmail: "${authorEmail}", dateEnroll: "${dateEnroll}", courseList:{connect: {id : "${courseId}"}} }
      )
      {
        id
      }
      publishManyUserEnrollCoursesConnection{
        edges {
          node {
            id
          }
        }
      }
    }
  `;
  const enrollResult = await request(MASTER_URL, enrollQuery);
  return enrollResult;
};

export const getUserEnrolledCourse = async (courseId, userEmail) => {
  const query =
    gql`
  query GetUserEnrolledCourse {
    userEnrollCourses(where: {courseId: "` +
    courseId +
    `", userEmail: "` +
    userEmail +
    `"}) {
      id
      courseId
      completedChapter {
        ... on CompletedChapter {
          chapterId
        }
      }
    }
  }
  `;
  const result = await request(MASTER_URL, query);
  //console.log("tüm kayıtlı kurslarım",result);
  return result;
};

export const MarkChapterCompleted = async (chapterId, recordId,isCompleted) => {
  const mutationQuery =
    gql`
  mutation markChapterCompleted {
    updateUserEnrollCourse(
      data: {completedChapter: {create: {CompletedChapter: {
      data: {
        chapterId: "` + chapterId +`",
        isCompleted: ` + isCompleted + `              
      }
    }}}}
      where: {id: "` +
    recordId +
    `"}
    ) {
      id
    }
    publishManyUserEnrollCoursesConnection {
      edges {
        node {
          id
        }
      }
    }
  }  
  `;
  const result = await request(MASTER_URL, mutationQuery);
  return result;
};

//mycoursedan detaya burdan
export const GetAllProgressCourse = async (userEmail) => {
  const query = gql`
  query MyQuery {
    userEnrollCourses(where: {
      userEmail: "`+userEmail+`"
    }) {
      completedChapter {
        ... on CompletedChapter {
          chapterId
        }
      }
      courseList {
        tags
        banner {
          url
        }
        chapter {
          ... on Chapter {
            id
            name
            shortDesc
            video {
              url
            }            
          }
        }
        id
        name
        free
        price
        description
      }
    }
  }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

export const GetCategory = async() => {
  const query = gql`
    query MyQuery {
      courseLists {
        tags
        counterEnroll
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
}


export const FilteredCategoryCourseList = async (category) => {
  const query = gql`
    query CourseLists($category: String!) {
      courseLists(where: { tags: $category }) {
        createdAt
        description
        free
        price
        id
        tags
        name
        publishedAt
        slug
        totalChapters
        updatedAt
        chapter {
          ... on Chapter {
            id
            name
            shortDesc
            video {
              id
              url
            }
          }
        }
        banner {
          id
          url
        }
        counterEnroll
      }
    }
  `;
  const variables = { category }; 
  try {
    const result = await request(MASTER_URL, query, variables); 
    return result;
  } catch (error) {
    console.error("FilteredCategoryCourseList hatası:", error);
    throw error;
  }
};

export const createCourse = async ({
  name,
  description,
  authorEmail,
  price,
  free,
  selectedCategory,
  coverPhoto,
  chapterName,
  chapterDesc,
  chapterNum,
  videoUri,
}) => {
  const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  let mutationQuery = `
    mutation MyMutation {
      createCourseList(
        data: {
          name: "${name}"
          description: "${description}"
          price: ${price}
          free: ${free}
          authorEmail: "${authorEmail}"
          tags: "${selectedCategory}"
          slug: "${slug}"
          totalChapters: 1,      
  `;

  if (coverPhoto) {
    mutationQuery += `
          banner: { connect: { id: "${coverPhoto}" } }
    `;
  }

  mutationQuery += `
          chapter: { create: { Chapter: {
            name: "${chapterName}"
            chapterNumber: ${chapterNum}
            shortDesc: "${chapterDesc}"
  `;

  if (videoUri) {
    mutationQuery += `
            video: { connect: { id: "${videoUri}" } }
    `;
  }

  mutationQuery += `
          } } }
  `;

  mutationQuery += `
        }
      ) {
        id
        totalChapters
      }
    }
  `;

  const result = await request(MASTER_URL, gql`${mutationQuery}`);
  return result;
};

export const  publishCourse = async (courseId) => {
  const publishCourseMutation = gql`
    mutation MyMutation {
      publishCourseList(
        where: { id: "${courseId}" }
        to: PUBLISHED
      ) {
        id
      }
    }
  `;
  const publishResult = await request(MASTER_URL, publishCourseMutation);
  return publishResult;
};

export const addChapter = async ({
  courseId,
  chapterName,
  chapterNum,
  chapterDesc,
  videoUri,
}) => {
  const publishCourseMutation = gql`
  mutation MyMutation {
    updateCourseList(
      data: {chapter: {create: {Chapter: {
        data: {
          name: "${chapterName}", 
          chapterNumber: ${chapterNum}, 
          shortDesc: "${chapterDesc}",
          video: {connect: {id: "${videoUri}" }}
       }
     }}}}
    where: { id: "${courseId}" }
  ) {
      id
    }
  }       
  `;
  const publishResult = await request(MASTER_URL, publishCourseMutation);
  return publishResult;
};


export const counterEnroll = async ( courseId, counter ) => {
  const mutationQuery = gql`
    mutation MyMutation {
      updateCourseList(
        where: { id: "` +courseId +`" },
        data: { counterEnroll: ${counter} }
      ) {
        counterEnroll
        id
      }
      publishCourseList(where: {id: "` +courseId +`"}, to: PUBLISHED) {
        counterEnroll
      }
    }
  `;

  try {
    const result = await request(MASTER_URL, mutationQuery);
    return result;
  } catch (error) {
    console.error('Counter artırma hatası:', error);
    throw error;
  }
};


export const GetCounter = async (courseId) => {
  const query = gql`
    query MyQuery {
      courseList(where: {id: "${courseId}"}) {
        counterEnroll
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};


export const GetIstatisticCourse = async (authorEmail) => {
  const query = gql`
  query MyQuery {
    courseLists(where: {authorEmail: "${authorEmail}"}) {
      id
      name
      price
      counterEnroll
      free
    }
  }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

export const deleteCourse = async (courseId) => {
  try {
    const mutationQuery = gql`
      mutation MyMutation {
        deleteCourseList(where: {id: "${courseId}"}) {
          id
          name
        }
      }
    `;

    const result = await request(MASTER_URL, mutationQuery);
    return result;
  } catch (error) {
    console.error('GraphQL isteği sırasında hata oluştu:', error);
    throw new Error('GraphQL isteği sırasında hata oluştu'); // Hata mesajını yeniden fırlat
  }
};


export const completedChapterInfo = async (courseId,userEmail) => {
  const query = gql`
  query MyQuery {
    userEnrollCourses(where: {courseId: "` +courseId +`", userEmail: "` +userEmail +`"}) {
      completedChapter {
        ... on CompletedChapter {
          isCompleted
          chapterId
        }
      }
    }
  }
  
  `;
  const result = await request(MASTER_URL, query);
  return result;
};


export const updateCourse = async ({ courseId, name, description, price, tags }) => {
  const slug = name.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
  
  const free = price > 0 ? false : true;
  const updateCourseMutation = gql`
    mutation MyMutation {
      updateCourseList(
        where: { id: "${courseId}" }
        data: {
          name: "${name}"
          description: "${description}"
          price: ${price}
          free: ${free}
          tags: "${tags}"
          slug: "${slug}"
        }
      ) {
        id
      }
    }
  `;
  const updateResult = await request(MASTER_URL, updateCourseMutation);
  return updateResult;
};
export const idToCourse = async (courseId) => {
  const query = gql`
  query MyQuery {
    courseList(where: { id: "${courseId}" }) {
      name
      description
      totalChapters
      free
      price
      tags   
    }
  }
  
  `;
  const result = await request(MASTER_URL, query);
  return result;
};


export const getChapterCompletionStatus = async (email) => {
  const query = gql`
    query MyQuery {
      userEnrollCourses(where: { userEmail: $email }) {
        completedChapter {
          ... on CompletedChapter {
            isCompleted
            chapterId
          }
        }
      }
    }
  `;

  const result = await request(MASTER_URL, query, variables);
  return result;
};

export const publishAsset = async (assetId) => {
  const publishAssetMutation = gql`
    mutation PublishAsset {
      publishAsset(
        where: { id: "${assetId}" }
        to: PUBLISHED
      ) {
        id
      }
    }
  `;

  const publishResult = await request(MASTER_URL, publishAssetMutation);
  return publishResult;
};

export const deleteEnrolledCourse = async (courseId) => {
  const deleteUserEnrolledCourse = gql`
  mutation MyMutation {
    deleteManyUserEnrollCourses(where: { courseId: "${courseId}" }) {
      count
    }
  }
  `;

  const publishResult = await request(MASTER_URL, deleteUserEnrolledCourse);
  return publishResult;
};

export const totalChaptersCounter = async ( courseId, totalChaptersCounter ) => {
  const mutationQuery = gql`
  mutation MyMutation {
    updateCourseList(
      data: {totalChapters: ${totalChaptersCounter}}, 
      where: { id: "${courseId}" }    
    ) {
      id
    }
    publishCourseList(where: {id: "` +courseId +`"}, to: PUBLISHED) {
      totalChapters
    }
  }
  `;

  try {
    const result = await request(MASTER_URL, mutationQuery);
    return result;
  } catch (error) {
    console.error('Total Chapters Counter artırma hatası:', error);
    throw error;
  }
};

export const GetTotalChapters = async (courseId) => {
  const query = gql`
    query MyQuery {
      courseList(where: {id: "${courseId}"}) {
        totalChapters
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

export const getChapterInfos = async (courseId) => {
  const query = gql`
  query MyQuery {
    courseList(where: {id: "${courseId}"}) {
      chapter {
        ... on Chapter {
          name
          chapterNumber
          shortDesc
          id
          video {
            url
          }
  
        }
      }
    }
  }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

export const updateChapterInfos = async ({
  courseId,
  chapterId,
  chapterNum,
  chapterName,
  chapterDesc,
  videoUri,
}) => {
  const mutationQuery = gql`
  mutation MyMutation(
    $courseId: ID!,
    $chapterId: ID!,
    $chapterNum: Int!,
    $chapterName: String!,
    $chapterDesc: String!,
    $videoUri: ID!
  ) {
    updateCourseList(
      data: {
        chapter: {
          update: {
            Chapter: {
              where: { id: $chapterId }
              data: {
                chapterNumber: $chapterNum
                name: $chapterName
                shortDesc: $chapterDesc
                video:  {connect: {id: $videoUri }}
              }
            }
          }
        }
      }
      where: { id: $courseId }
    ) {
      id
    }
  }
  `;
  const publishResult = await request(MASTER_URL, mutationQuery, {
    courseId,
    chapterId,
    chapterNum,
    chapterName,
    chapterDesc,
    videoUri,
  });
  
  return publishResult;
};


export const deleteChapter = async ({courseId,chapterId}) => {
  const handleDeleteChapter = gql`
  mutation MyMutation {
    updateCourseList(
      where: {id: "${courseId}"}
      data: {chapter: {delete: {Chapter: {id: "${chapterId}"}}}}
    ) {
      id
    }
  }
  `;

  const publishResult = await request(MASTER_URL, handleDeleteChapter);
  return publishResult;
};

export const creategisterCounter = async ({ authorEmail }) => {
  const handleCreateRegisterCounter = gql`
  mutation MyMutation {
    createUserInfo(
      data: { email: "${authorEmail}" }
    ) {
      id
    }
  }
  `;

  const handlePublishUserInfo = gql`
  mutation PublishUserInfo {
    publishUserInfo(where: { email: "${authorEmail}" }) {
      id
      completedChapterCounter
    }
  }
  `;

  try {
    const createResult = await request(MASTER_URL, handleCreateRegisterCounter);
    const publishResult = await request(MASTER_URL, handlePublishUserInfo);
    
    return { createResult, publishResult };
  } catch (error) {
    console.error("GraphQL mutation error:", error);
    throw error;
  }
};


export const updateRegisterCounter = async ({ authorEmail, completedChapterCounter }) => {
  const handleUpdateChapter = gql`
  mutation MyMutation {
    updateUserInfo(data: { completedChapterCounter: ${completedChapterCounter} }, where: { email: "${authorEmail}" }) {
      id
      completedChapterCounter
    }
  }
  `;

  const handlePublishUserInfo = gql`
  mutation PublishUserInfo {
    publishUserInfo(where: { email: "${authorEmail}" }) {
      id
      completedChapterCounter
    }
  }
  `;

  try {
    const updateResult = await request(MASTER_URL, handleUpdateChapter);
    const publishResult = await request(MASTER_URL, handlePublishUserInfo);

    return { updateResult, publishResult };
  } catch (error) {
    console.error("GraphQL mutation error:", error);
    throw error;
  }
};


export const getUserInfoCounter = async (authorEmail) => {
  const query = gql`
  query MyQuery {
    userInfo(where: { email: "${authorEmail}" }) {
      completedChapterCounter
    }
  }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};


export const getLeaderTable = async () => {
  const query = gql`
  query MyQuery {
    userInfos(orderBy: completedChapterCounter_DESC) {
      completedChapterCounter
      email
    }
  }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};
