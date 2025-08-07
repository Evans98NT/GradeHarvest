  javascript
   module.exports = {
     async rewrites() {
       return [
         {
           source: '/api/:path*',  // Matches API paths
           destination: 'http://localhost:5000/api/:path*', // Redirects to backend
         },
       ];
     },
   };
   