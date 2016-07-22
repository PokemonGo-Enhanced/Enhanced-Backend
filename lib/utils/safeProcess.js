// This function is needed to make sure that we can get an optimizable function
module.exports = function safeProcess(fn) {
  try {
    fn();
  } catch (e) {
    process.stderr.write(e.stack);
    process.stderr.write('\n');
  }
};
