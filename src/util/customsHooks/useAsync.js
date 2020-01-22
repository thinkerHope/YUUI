import { useEffect, useRef, useState } from "react";
// 管理异步函数
export const useAsync = () => {
    
}

// export const useDataApi = (initialUrl, initialData) => {
//   const [url, setUrl] = useState(initialUrl)

//   const [state, dispatch] = useReducer(dataFetchReducer, {
//     isLoading: false,
//     isError: false,
//     data: initialData,
//   })

//   useEffect(() => {
//     let didCancel = false

//     const fetchData = async () => {
//       dispatch({ type: 'FETCH_INIT' })

//       try {
//         const result = await axios(url)
//         if (!didCancel) {
//           dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
//         }
//       } catch (err) {
//         if (!didCancel) {
//           dispatch({ type: 'FETCH_FAILURE' })
//         }
//       }
//     }
//     fetchData()
//     return () => {
//       didCancel = true
//     }
//   }, [url])

//   const doFetch = url => setUrl(url)
//   // 暴露状态
//   return { ...state, doFetch }
// }