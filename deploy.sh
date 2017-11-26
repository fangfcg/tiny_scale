npm run build1
npm run build2
rm -r server/public/*
cp -r client/client/dist/* server/public
mv server/public/index.html server/public/customer.html
cp -r client/operator/dist/* server/public
mv server/public/index.html server/public/operator.html
cp -r client/client/src/assets server/public