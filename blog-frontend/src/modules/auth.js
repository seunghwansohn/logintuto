import { createAction } from 'redux-actions';
import produce from 'immer';
import { takeLatest } from 'redux-saga/effects';
import createRequestSaga, {
  createRequestActionTypes
} from '../lib/createRequestSaga';
import * as authAPI from '../lib/api/auth';

const CHANGE_FIELD = 'auth/CHANGE_FIELD';
const INITIALIZE_FORM = 'auth/INITIALIZE_FORM';

const [REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE] = createRequestActionTypes(
  'auth/REGISTER'
);

const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE] = createRequestActionTypes(
  'auth/LOGIN'
);

export const changeField = ({ form, key, value }) => ({
  type : CHANGE_FIELD,
  form : form,
  key : key,
  value : value
})
//폼 전환 시 회원 인증 에러 초기화
export const initializeForm = form => ({ //// register / login
  type : INITIALIZE_FORM,
  form : form
})
export const register = ({ username, password }) => ({ 
  type : REGISTER,
  username : username,
  password : password
})
export const login = ({ username, password }) => ({ 
  type : LOGIN,
  username : username,
  password : password
})

// saga 생성
const registerSaga = createRequestSaga(REGISTER, authAPI.register);
const loginSaga = createRequestSaga(LOGIN, authAPI.login);
export function* authSaga() {
  yield takeLatest(REGISTER, registerSaga);
  yield takeLatest(LOGIN, loginSaga);
}

const initialState = {
  register: {
    username: '',
    password: '',
    passwordConfirm: ''
  },
  login: {
    username: '',
    password: ''
  },
  auth: null,
  authError: null
};

function auth(state = initialState, action) {
  switch (action.type) {
    case CHANGE_FIELD:
      return produce(state, draft => {
        draft[action.form][action.key] = action.value   //[]부분은 하위객체 선택을 변수화한것
      })
    case INITIALIZE_FORM: //
      return ({
        ...state,
        form : initialState[action.form],
        authError:null //폼 전환 시 회원 인증 에러 초기화
      })
    case REGISTER_SUCCESS:
      return ({
        ...state,
        authError: null,
        auth
      })
    case REGISTER_FAILURE:
      return ({
        ...state,
        authError: action.error
      })
    case LOGIN_SUCCESS:
      return ({
        ...state,
        authError: null,
        auth
      })
    case LOGIN_FAILURE:
      return ({
        ...state,
        authError: action.error
      })
    default :
      return state
  }
}

export default auth;
