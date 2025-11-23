// Simple test to verify white label PDF functionality
const { testWhiteLabelPDF } = require('./lib/test-white-label-pdf');

console.log('🧪 Starting White Label PDF Tests...\n');

testWhiteLabelPDF()
  .then((result) => {
    if (result.success) {
      console.log('🎉 All tests completed successfully!');
      console.log('\n📊 Test Results:');
      result.results?.forEach((test) => {
        console.log(`  ✅ ${test.type}: PDF generated`);
        if (test.result.filePath) {
          console.log(`     📁 Path: ${test.result.filePath}`);
          console.log(`     📏 Size: ${test.result.buffer?.length} bytes`);
        }
      });
    } else {
      console.error('❌ Tests failed:', result.error);
    }
  })
  .catch((error) => {
    console.error('💥 Test execution failed:', error.message);
  });