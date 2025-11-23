// Using Node.js built-in fetch (available in Node 18+)

// Test the audit API endpoint
async function testAuditAPI() {
  try {
    console.log('🧪 Testing Audit API Data Storage');
    console.log('===================================\n');
    
    // First, register a test user if needed
    console.log('1. Creating/Logging in test user...');
    const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Test@123456',
        name: 'Test User'
      })
    });
    
    let registerData;
    try {
      registerData = await registerResponse.json();
    } catch (e) {
      console.log('Failed to parse register response:', e);
      console.log('Response text:', await registerResponse.text());
      return;
    }
    
    if (!registerResponse.ok) {
      console.log('❌ Registration failed:', registerData.error || 'Unknown error');
      // Try logging in instead
      const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'Test@123456'
        })
      });
      
      if (!loginResponse.ok) {
        console.log('❌ Login also failed:', await loginResponse.text());
        return;
      }
      
      registerData = await loginResponse.json();
    }
    
    console.log('✅ User authenticated successfully');
    const token = registerData.token || registerData.user?.token;
    
    if (!token) {
      console.log('❌ No authentication token received');
      return;
    }
    
    console.log('2. Running audit on example.com...');
    
    // Now test the audit endpoint
    const auditResponse = await fetch('http://localhost:3000/api/audit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        url: 'https://example.com'
      })
    });
    
    if (!auditResponse.ok) {
      console.log('❌ Audit failed:', await auditResponse.text());
      return;
    }
    
    const auditData = await auditResponse.json();
    console.log('✅ Audit completed successfully');
    console.log('📊 Audit score:', auditData.overallScore);
    console.log('🔍 Issues found:', auditData.issues ? auditData.issues.length : 0);
    
    console.log('\n3. Checking if data was stored in database...');
    
    // Try to get the audit results from the database via API
    const dbCheckResponse = await fetch('http://localhost:3000/api/dashboard/recent-audits', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (dbCheckResponse.ok) {
      const dbData = await dbCheckResponse.json();
      console.log('✅ Data retrieved from database');
      console.log('📋 Recent audits count:', dbData.length);
      if (dbData.length > 0) {
        console.log('📝 Most recent audit:', dbData[0].url || dbData[0].domain);
      }
    } else {
      console.log('⚠️ Could not verify data storage in database');
    }
    
    console.log('\n🎉 Test completed!');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testAuditAPI();