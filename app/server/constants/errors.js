const errors = {
  INTERNAL_ERROR: {
    code: '00001',
    message: 'INTERNAL_ERROR'
  },
  INVALID_ID_ERROR: {
    code: '00002',
    message: 'INVALID_ID_ERROR'
  },
  ITEM_DOES_NOT_EXIST_ERROR: {
    code: '00003',
    message: 'ITEM_DOES_NOT_EXIST_ERROR'
  },
  NO_PRIVILEGE_ERROR: {
    code: '00004',
    message: 'NO_PRIVILEGE_ERROR'
  },
  FIELD_VALIDATION_ERROR: {
    code: '00005',
    message: 'FIELD_VALIDATION_ERROR'
  },
  USERNAME_OR_EMAIL_EXISTS_ERROR: {
    code: '00006',
    message: 'USERNAME_OR_EMAIL_EXISTS_ERROR'
  },
  USER_NOT_LOGGED_IN_ERROR: {
    code: '00007',
    message: 'USER_NOT_LOGGED_IN_ERROR'
  }
}


module.exports = errors;