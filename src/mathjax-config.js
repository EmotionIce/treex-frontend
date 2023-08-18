window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$', '$'], ['\\[', '\\]']],
  },
  startup: {
    pageReady: () => {
      //
      // This delay is needed to give MathJax a chance to finish processing
      //
      return Promise.resolve();
    }
  }
};
