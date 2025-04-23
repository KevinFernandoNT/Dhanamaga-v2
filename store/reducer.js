import {combineReducers} from 'redux';
import auth from './modules/auth/';
import home from './modules/home/';
import courses from './modules/courses/';
import lessons from './modules/lessons'
import policies from './modules/policies'
import question from './modules/questions/'
import language from './modules/language/'

const reducers = combineReducers({
  auth: auth,
  home: home,
  courses: courses,
  lessons:lessons,
  policies:policies,
  question:question,
  language:language
});

export default reducers;
