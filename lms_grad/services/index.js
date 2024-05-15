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
        tag
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

  const result = await request(MASTER_URL, query);
  return result;
};

export const enrollCourse = async (courseId, userEmail) => {
  const mutationQuery =
    gql`
  mutation MyMutation {
    createUserEnrollCourse(
      data: {courseId: "` +
    courseId +
    `", 
      userEmail: "` +
    userEmail +
    `",courseList: {connect: {id:"` +
    courseId +
    `"}}}
      ) {
      id
    }
    publishManyUserEnrollCoursesConnection(to: PUBLISHED) {
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
        tag
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
        tag
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
}


export const FilteredCategoryCourseList = async (category) => {
  const query = gql`
  query CourseLists {
    courseLists(where: {tag: `+category+`}) {
      createdAt
      description
      free
      price
      id
      tag
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
    }
  }
  `
  const result = await request(MASTER_URL, query);
  return result;

}

// export const createCourse = async (authorEmail) => {
//   const mutationQuery =
//     gql`
//     mutation MyMutation {
//       createCourseList(
//         data: {name: "", description: "", tag: expo, totalChapters: 10, price: 1.5, free: false}
//       ) {
//         banner {
//           url
//         }
//         chapter {
//           ... on Chapter {
//             id
//             name
//             shortDesc
//             video {
//               url
//             }
//             chapterNumber
//           }
//         }
//       }
//     }
//   `;
//   const result = await request(MASTER_URL, mutationQuery);
//   return result;
// };

export const createCourse = async ({
  name,
  description,
  authorEmail,
  totalChapters,
  price,
  free,
  selectedCategory,
}) => {
  const mutationQuery = gql`
    mutation MyMutation {
      createCourseList(
        data: {
          name: "${name}"
          description: "${description}"
          totalChapters: ${totalChapters}
          price: ${price}
          free: ${free}
          authorEmail: "${authorEmail}"
          tag: ${selectedCategory}
        }
      ) {
        id
      }
    }
  `;

  const result = await request(MASTER_URL, mutationQuery);
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



export const updateCourse = async ({ courseId, name, description, totalChapters, price, selectedCategory }) => {
  const slug = name.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
  
  const free = price > 0 ? false : true;
  const updateCourseMutation = gql`
    mutation MyMutation {
      updateCourseList(
        where: { id: "${courseId}" }
        data: {
          name: "${name}"
          description: "${description}"
          totalChapters: ${totalChapters}
          price: ${price}
          free: ${free}
          tag: ${selectedCategory}
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
      tag
    }
  }
  
  `;
  const result = await request(MASTER_URL, query);
  return result;
};


export const getChapterCompletionStatus = async (courseId, email) => {
  const query = gql`
    query MyQuery {
      userEnrollCourses(where: { courseId: $courseId, userEmail: $email }) {
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