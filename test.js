// // const sol = (poisonous , allergic) =>{
// //     let map = new Map();
// //     for(let i=0 ; i<poisonous.length ; i++){
// //         let p = poisonous[i];
// //         let a = allergic[i];
// //         if(!map.get(p)){
// //             map.set(p , []);
// //         }
// //         if(!map.get(a)){
// //             map.set(a , []);
// //         }
// //         if(p<a && !map.get(p).includes(a)){
// //             map.get(p).push(a);
// //         }
// //         if(a<p && !map.get(a).includes(p)){
// //             map.get(a).push(p);
// //         }
// //     }
// //     console.log(map);
// // }

// // // sol([2,1,3] , [3,3,1]);
// // // sol([1,2] , [3,5]);


// // function od(n , m){
// //     let cost = [];
// //     for (let i = 0; i< n; i++) {
// //         cost[i] = [];
// //         for(let j = 0; j< n; j++) {
// //             cost[i].push(0);
// //         }
// //     }
// //     console.log(cost);

// // }
// // od(5,6);


// // function bioHazard(n, allergic, poisonous) {
// //     const d = {};
// //     for (let i = 0; i < allergic.length; i++) {
// //         const a = allergic[i];
// //         const b = poisonous[i];
// //         const [min, max] = [a, b].sort((x, y) => x - y);
// //         d[max] = Math.max(d[max] || -1, min);
// //     }
    
// //     for (let i = 1; i <= n; i++) {
// //         d[i] = Math.max(d[i] || -1, d[i - 1] || -1);
// //     }
    
// //     let res = 0;
// //     for (let i = 1; i <= n; i++) {
// //         if (d[i] === -1) {
// //             res += i;
// //         } else {
// //             res += i - d[i];
// //         }
// //     }
    
// //     return res;
// // }

// // // Example usage
// // const n = 5;
// // const allergic = [1,2];
// // const poisonous = [3,5];
// // const result = bioHazard(n, allergic, poisonous);
// // console.log(result); // Output will be the calculated result

// // function getMinimumTime(connectionNodes, connectionFrom, connectionTo, connectionWeight, deliveries) {
// //     const graph = Array.from({ length: connectionNodes }, () => []);
// //     for (let i = 0; i < connectionFrom.length; i++) {
// //         graph[connectionFrom[i]].push({ node: connectionTo[i], weight: connectionWeight[i] });
// //         graph[connectionTo[i]].push({ node: connectionFrom[i], weight: connectionWeight[i] });
// //     }

// //     function dijkstra(start) {
// //         const distances = new Array(connectionNodes).fill(Infinity);
// //         distances[start] = 0;
// //         const heap = [{ dist: 0, node: start }];

// //         while (heap.length > 0) {
// //             const { dist, node } = heap.shift();
// //             if (dist > distances[node]) {
// //                 continue;
// //             }
// //             for (const { node: neighbor, weight } of graph[node]) {
// //                 if (distances[node] + weight < distances[neighbor]) {
// //                     distances[neighbor] = distances[node] + weight;
// //                     heap.push({ dist: distances[neighbor], node: neighbor });
// //                     heap.sort((a, b) => a.dist - b.dist); // Simple sorting for this example
// //                 }
// //             }
// //         }

// //         return distances;
// //     }

// //     const shortestPaths = dijkstra(0);

// //     let minTime = Infinity;
// //     for (const delivery of deliveries) {
// //         minTime = Math.min(minTime, shortestPaths[delivery] + shortestPaths[0]);
// //     }
// //     console.log(shortestPaths);
// //     return minTime;
// // }
// function getMinimumTime(connectionNodes, connectionFrom, connectionTo, connectionWeight, deliveries) {
//     let n = connectionNodes;
//     let m = connectionFrom.length;
//     let k = deliveries.length;
//     let dp = new Array(1 << k).fill().map(() => new Array(k).fill(Infinity));
//     let g = new Array(n).fill().map(() => new Array());
//     for (let i = 0; i < m; i++) {
//         g[connectionFrom[i]].push([connectionTo[i], connectionWeight[i]]);
//         g[connectionTo[i]].push([connectionFrom[i], connectionWeight[i]]);
//     }
//     let dist = new Array(n).fill().map(() => new Array(n).fill(Infinity));
//     for (let i = 0; i < n; i++) {
//         dist[i][i] = 0;
//         let q = [[i, 0]];
//         while (q.length) {
//             let [u, d] = q.shift();
//             if (d > dist[i][u]) continue;
//             for (let [v, w] of g[u]) {
//                 if (dist[i][v] > d + w) {
//                     dist[i][v] = d + w;
//                     q.push([v, dist[i][v]]);
//                 }
//             }
//         }
//     }
//     for (let i = 0; i < k; i++) {
//         dp[1 << i][i] = dist[0][deliveries[i]];
//     }
//     for (let mask = 1; mask < (1 << k); mask++) {
//         for (let i = 0; i < k; i++) {
//             if ((mask & (1 << i)) == 0) continue;
//             for (let j = 0; j < k; j++) {
//                 if ((mask & (1 << j)) != 0) continue;
//                 dp[mask | (1 << j)][j] = Math.min(dp[mask | (1 << j)][j], dp[mask][i] + dist[deliveries[i]][deliveries[j]]);
//             }
//         }
//     }
//     let ans = Infinity;
//     for (let i = 0; i < k; i++) {
//         ans = Math.min(ans, dp[(1 << k) - 1][i] + dist[deliveries[i]][0]);
//     }
//     return ans;
// }
// // console.log(getMinimumTime(3 , [0,1,2] , [1,2,0] , [10,30,10] , [1,2])); //40
// // console.log(getMinimumTime(3 , [0,1,0] , [1,2,2] , [10,20,50] , [1,2])); //60
// // console.log(getMinimumTime(5 , [0,0,4,4,1,1] , [1,4,1,3,2,3] , [10,3,5,4,2,4] , [1,3])); //19

// console.log(new Array(1 << 2).fill().map(() => new Array(2).fill(Infinity)));