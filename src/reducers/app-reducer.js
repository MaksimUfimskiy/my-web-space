const initialState = {
  file: {
    path: ''
  }
};

const appExample = (state = initialState, action) => {
  switch (action.type) {
    case 'OPEN_FILE':
      return {
        file: action.file
      };
    default:
      return state
  }
};

export default appExample;