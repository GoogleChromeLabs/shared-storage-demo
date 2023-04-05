window.addEventListener('message', ({ data }) => {
  switch (data) {
    case 'run-third-party-write-demo': 
      window.sharedStorage.set('third-party-write-demo', 'written into publisher storage by third-party code');
      break;
    case 'clear-publisher-data': 
      window.sharedStorage.delete('third-party-write-demo');
      break;
  }
});
