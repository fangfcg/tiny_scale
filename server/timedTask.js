const admin =  require('./api/admin');
//每隔一天清除缓存中的count
setInterval(admin.clearCertificate, 86400000);