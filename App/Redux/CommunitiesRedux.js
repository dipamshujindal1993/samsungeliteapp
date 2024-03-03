import {createReducer, createActions} from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  getCommunities: ['pageNumber'],
  getCommunitiesSuccess: ['communities'],
  getCommunitiesFailure: null,
  getCommunityPost: ['communityId', 'pageNumber'],
  getCommunityPostSuccess: ['communityPost'],
  getCommunityPostFailure: null,
  savePost: ['communityId', 'postData'],
  savePostSuccess: null,
  savePostFailure: null,
  resetCommunityPostSuccess: null,
  uploadFile: ['communityId', 'file', 'fileIndex', 'isThumb'],
  uploadFileSuccess: ['responseData'],
  uploadFileFailure: ['responseData'],
  removeAllAttachedFiles: null,
  removeAttachedFile: ['index'],
  getPostDetail: ['discussionId'],
  getPostDetailSuccess: ['postViewData'],
  getPostDetailFailure: null,
  likeCommunityPost: ['discussionId'],
  likeCommunityPostSuccess: null,
  likeCommunityPostFailure: null,
  unlikeCommunityPost: ['discussionId'],
  unlikeCommunityPostSuccess: null,
  unlikeCommunityPostFailure: null,
  getPostCommentList: ['discussionId'],
  getPostCommentSuccess: ['postCommentList'],
  getPostCommentFailure: null,
  likeCommunityCommentPost: ['replyId', 'discussionId'],
  likeCommunityCommentPostSuccess: null,
  likeCommunityCommentPostFailure: null,
  dislikeCommunityCommentPost: ['replyId', 'discussionId'],
  dislikeCommunityCommentPostSuccess: null,
  dislikeCommunityCommentPostFailure: null,
  deletePost: ['discussionId'],
  deletePostSuccess: null,
  deletePostFailure: null,
  updatePost: ['discussionId', 'postData'],
  updatePostSuccess: null,
  updatePostFailure: null,
  addComment: ['discussionId', 'postData'],
  addCommentSuccess: null,
  addCommentFailure: null,
  updateComment: ['replyId', 'postData'],
  updateCommentSuccess: null,
  updateCommentFailure: null,
  resetAddCommentSuccess: null,
  deleteComment: ['replyId'],
  deleteCommentSuccess: null,
  deleteCommentFailure: null,
})

export const CommunitiesTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  communities: [],
  communityPost: [],
  attachedFiles: [],
  postViewData: {},
  isLikeSuccess: undefined,
  isUnlikeSuccess: undefined,
  postCommentList: [],
  isLikeCommentSuccess: undefined,
  isDislikeCommentSuccess: undefined
})

/* ------------- Selectors ------------- */

export const CommunitiesSelectors = {};

/* ------------- Reducers ------------- */

export const getCommunities = state =>
  state.merge({isCommunityLoadingError: false});

export const getCommunitiesSuccess = (state, {communities}) =>
  state.merge({communities, isCommunityLoadingError: false});

export const getCommunitiesFailure = state => 
  state.merge({isCommunityLoadingError: true});

export const getCommunityPost = state =>
  state.merge({isCommunityPostLoadingError: false});

export const getCommunityPostSuccess = (state, {communityPost}) =>
  state.merge({communityPost, isCommunityPostLoadingError: false});

export const getCommunityPostFailure = state => 
  state.merge({isCommunityPostLoadingError: true});

export const savePost = state =>
  state.merge({postSuccess: false, postFailure: false, updatePostSuccess: false});

export const savePostSuccess = state =>
  state.merge({attachedFiles: [], postSuccess: true, postFailure: false});

export const savePostFailure = state =>
  state.merge({attachedFiles: [], postSuccess: false, postFailure: true});

export const resetCommunityPostSuccess = state => {
    return state.merge({postSuccess:false});
  };

export const uploadFile = state => {
  return state.merge({uploadFileSuccess: false, uploadFileFailure: false});
};

export const uploadFileSuccess = (state, {responseData}) => {
  let attachedFiles = [...state.attachedFiles];
  if (attachedFiles.length) {
    for(let i=0; i<attachedFiles.length; i++){
      let file = attachedFiles[i]
      if (file.fileIndex != responseData.fileIndex) {
        attachedFiles.push(responseData);
        break
      }
      else{
        attachedFiles.map((existFile, idx) => {
          if (existFile.fileIndex == responseData.fileIndex) {
            attachedFiles.splice(idx, 1, {...existFile, ...responseData});
          }
        });
      }
    }
  } else {
    attachedFiles.push(responseData);
  }

  return state.merge({
    attachedFiles,
    uploadFileSuccess: true,
    uploadFileFailure: false,
  });
};

export const uploadFileFailure = (state, {responseData}) => {
  const uploadedFile = state.attachedFiles.filter(
    file => file.fileIndex != responseData.fileIndex,
  );
  return state.merge({
    attachedFiles: [...uploadedFile, responseData],
    uploadFileSuccess: false,
    uploadFileFailure: true,
  });
};

export const removeAllAttachedFiles = state => {
  return state.merge({attachedFiles: []});
};

export const removeAttachedFile = (state, {index}) => {
  const remainedFile = state.attachedFiles.filter(
    file => file.fileIndex != index,
  );
  return state.merge({attachedFiles: remainedFile});
};

export const getPostDetail = state =>
  state.merge({postViewData: ''});

export const getPostDetailSuccess = (state, {postViewData}) =>
  state.merge({
    postViewData,
    isLikeSuccess: undefined,
    isUnlikeSuccess: undefined
});

export const getPostDetailFailure = state => state.merge({postViewData:null});

export const likeCommunityPostSuccess = state => {
  return state.merge({ isLikeSuccess: true});
};

export const likeCommunityPostFailure = state =>
  state.merge({isLikeSuccess: false});

export const unlikeCommunityPostSuccess = state => {
  return state.merge({ isUnlikeSuccess: true});
};

export const unlikeCommunityPostFailure = state =>
  state.merge({isUnlikeSuccess: false});

export const getPostCommentSuccess = (state, { postCommentList }) =>
  state.merge({ postCommentList, isLikeCommentSuccess: undefined, isDislikeCommentSuccess: undefined })

export const getPostCommentFailure = (state) =>
  state.merge({ postCommentList: [] })

export const likeCommunityCommentPostSuccess = (state) => {
  return state.merge({ isLikeCommentSuccess: true })
}
export const likeCommunityCommentPostFailure = (state) =>
  state.merge({ isLikeCommentSuccess: false })

export const dislikeCommunityCommentPostSuccess = (state) => {
  return state.merge({ isDislikeCommentSuccess: true })
}
export const dislikeCommunityCommentPostFailure = (state) =>
  state.merge({ isDislikeCommentSuccess: false })

export const deletePost = (state) =>
  state.merge({ isDeleteSuccess: false, isDeleteFailure: false })

export const deletePostSuccess = (state) =>
  state.merge({ isDeleteSuccess: true, isDeleteFailure: false })

export const deletePostFailure = (state) =>
  state.merge({ isDeleteSuccess: false, isDeleteFailure: true })

export const updatePost = (state) =>
  state.merge({ updatePostSuccess: false, updatePostFailure: false, postSuccess:false })

export const updatePostSuccess = (state) =>
  state.merge({ attachedFiles: [], updatePostSuccess: true, updatePostFailure: false })

export const updatePostFailure = (state) =>
  state.merge({ attachedFiles: [], updatePostSuccess: false, updatePostFailure: true })

export const addComment = state =>
  state.merge({addCommentSuccess: false, addCommentFailure: false, updateCommentSuccess:false});

export const addCommentSuccess = state =>
  state.merge({attachedFiles: [], addCommentSuccess: true, addCommentFailure: false});

export const addCommentFailure = state =>
  state.merge({attachedFiles: [], addCommentSuccess: false, addCommentFailure: true});

export const updateComment = (state) =>
  state.merge({ updateCommentSuccess: false, updateCommentFailure: false, addCommentSuccess: false })

export const updateCommentSuccess = (state) =>
  state.merge({ attachedFiles: [], updateCommentSuccess: true, updateCommentFailure: false })

export const updateCommentFailure = (state) =>
  state.merge({ attachedFiles: [], updateCommentSuccess: false, updateCommentFailure: true })

 export const resetAddCommentSuccess = state => {
    return state.merge({addCommentSuccess:false});
  };

export const deleteComment = (state) =>
  state.merge({ isCommentDeleteSuccess: false, isCommentDeleteFailure: false })

export const deleteCommentSuccess = (state) =>
  state.merge({ isCommentDeleteSuccess: true, isCommentDeleteFailure: false })

export const deleteCommentFailure = (state) =>
  state.merge({ isCommentDeleteSuccess: false, isCommentDeleteFailure: true })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_COMMUNITIES]: getCommunities,
  [Types.GET_COMMUNITIES_SUCCESS]: getCommunitiesSuccess,
  [Types.GET_COMMUNITIES_FAILURE]: getCommunitiesFailure,
  [Types.GET_COMMUNITY_POST]: getCommunityPost,
  [Types.GET_COMMUNITY_POST_SUCCESS]: getCommunityPostSuccess,
  [Types.GET_COMMUNITY_POST_FAILURE]: getCommunityPostFailure,
  [Types.SAVE_POST]: savePost,
  [Types.SAVE_POST_SUCCESS]: savePostSuccess,
  [Types.SAVE_POST_FAILURE]: savePostFailure,
  [Types.RESET_COMMUNITY_POST_SUCCESS]: resetCommunityPostSuccess,
  [Types.UPLOAD_FILE]: uploadFile,
  [Types.UPLOAD_FILE_SUCCESS]: uploadFileSuccess,
  [Types.UPLOAD_FILE_FAILURE]: uploadFileFailure,
  [Types.REMOVE_ALL_ATTACHED_FILES]: removeAllAttachedFiles,
  [Types.REMOVE_ATTACHED_FILE]: removeAttachedFile,
  [Types.GET_POST_DETAIL_SUCCESS]: getPostDetailSuccess,
  [Types.GET_POST_DETAIL_FAILURE]: getPostDetailFailure,
  [Types.LIKE_COMMUNITY_POST_SUCCESS]: likeCommunityPostSuccess,
  [Types.LIKE_COMMUNITY_POST_FAILURE]: likeCommunityPostFailure,
  [Types.UNLIKE_COMMUNITY_POST_SUCCESS]: unlikeCommunityPostSuccess,
  [Types.UNLIKE_COMMUNITY_POST_FAILURE]: unlikeCommunityPostFailure,
  [Types.GET_POST_COMMENT_SUCCESS]: getPostCommentSuccess,
  [Types.GET_POST_COMMENT_FAILURE]: getPostCommentFailure,
  [Types.LIKE_COMMUNITY_COMMENT_POST_SUCCESS]: likeCommunityCommentPostSuccess,
  [Types.LIKE_COMMUNITY_COMMENT_POST_FAILURE]: likeCommunityCommentPostFailure,
  [Types.DISLIKE_COMMUNITY_COMMENT_POST_SUCCESS]: dislikeCommunityCommentPostSuccess,
  [Types.DISLIKE_COMMUNITY_COMMENT_POST_FAILURE]: dislikeCommunityCommentPostFailure,
  [Types.DELETE_POST]: deletePost,
  [Types.DELETE_POST_SUCCESS]: deletePostSuccess,
  [Types.DELETE_POST_FAILURE]: deletePostFailure,
  [Types.UPDATE_POST]: updatePost,
  [Types.UPDATE_POST_SUCCESS]: updatePostSuccess,
  [Types.UPDATE_POST_FAILURE]: updatePostFailure,
  [Types.ADD_COMMENT]: addComment,
  [Types.ADD_COMMENT_SUCCESS]: addCommentSuccess,
  [Types.ADD_COMMENT_FAILURE]: addCommentFailure,
  [Types.UPDATE_COMMENT]: updateComment,
  [Types.UPDATE_COMMENT_SUCCESS]: updateCommentSuccess,
  [Types.UPDATE_COMMENT_FAILURE]: updateCommentFailure,
  [Types.RESET_ADD_COMMENT_SUCCESS]: resetAddCommentSuccess,
  [Types.DELETE_COMMENT]: deleteComment,
  [Types.DELETE_COMMENT_SUCCESS]: deleteCommentSuccess,
  [Types.DELETE_COMMENT_FAILURE]: deleteCommentFailure,
})
