import React, { useEffect,useState } from 'react'
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";



const News = (props)=> {
  const [articles, setAcricles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  
  
  const capitalFirstLetter = (String) => {
    return  String.charAt(0).toUpperCase()+String.slice(1);
  }
  const updateNews = async ()=>{
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=e5ab6f4d8f7f46a79ae01d721c2bf2ba&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(70);
    console.log(parsedData);
    setAcricles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    props.setProgress(100);
  }
  useEffect(()=>{
    document.title = `News-Shila-${capitalFirstLetter(props.category)}`;
    updateNews();
    }, [])

    // const handelPrevClick = async ()=> {
    //   setPage(page-1);
    //   updateNews();
    // }
    // const handelNextClick = async ()=> {
    //   setPage(page+1);
    //   updateNews();
    // }

    const fetchMoreData = async () => {
      const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=e5ab6f4d8f7f46a79ae01d721c2bf2ba&page=${page+1}&pageSize=${props.pageSize}`;
      setPage(page+1);
      let data = await fetch(url);
      let parsedData = await data.json();
      setAcricles(articles.concat(parsedData.articles));
      setTotalResults(parsedData.totalResults);
    };
    
    return (
      <>
        <h1 className='text-center' style={{marginTop: "70px"}}>News_Shila - Top Headlines-{capitalFirstLetter(props.category)}</h1>
        {loading && <Spinner/>}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner/>}
        >
        <div className="container">
        <div className="row">
        {  (articles.map((element)=>{
            return <div className="col-md-3" key={element.url}>
                   <NewsItem source={element.source.name} author={element.author} date={element.publishedAt} title={element.title?element.title.slice(0,40):""} description={element.description?element.description.slice(0,88):""} imageUrl={element.urlToImage} newsUrl={element.url}/>
                   </div>

        }))}
        </div>
        </div>
        </InfiniteScroll>
        {/* <div className="container d-flex justify-content-between">
        <button disabled={page<=1} type="button" onClick={handelPrevClick} className="btn btn-primary">&larr; previous</button>
        <button disabled={page+1 > Math.ceil(totalResults/props.pageSize)} type="button" onClick={handelNextClick} className="btn btn-primary">next &rarr;</button>
        </div> */}
      </>
    )
}
News.defaultProps = {
  country: 'in',
  pageSize: 8,
  category: "general"
}
News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
}

export default News
