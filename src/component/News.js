import React, { Component } from "react";
import NewsItem from "./NewsItem";
import PropTypes from "prop-types";
import Spinner from "./Spinner";
import InfiniteScroll from "react-infinite-scroll-component";
export class News extends Component {
  articles = [
    {
      source: { id: "the-washington-post", name: "The Washington Post" },
      author: "Adam Taylor, William Neff, Daniel Wolfe",
      title:
        "For Ukraine, what's so special about Germany's Leopard 2 tanks? - The Washington Post",
      description:
        "The German-made battle tank may be a highly prized piece of military technology, but the logistic networks that could support it may be even more important.",
      url: "https://www.washingtonpost.com/world/2023/01/24/leopard-2-ukraine-germany-m1-abrams/",
      urlToImage:
        "https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/F3TJUX3KEOWTZBL37M2CJ6J67M.jpg&w=1440",
      publishedAt: "2023-01-24T10:00:00Z",
      content:
        "Comment on this story\r\nAs the war in Ukraine nears its one-year mark, Kyiv is pushing Western allies to provide modern battle tanks for its fight with Russian forces. And theres one particular model … [+7540 chars]",
    },
    {
      source: { id: null, name: "BBC News" },
      author: "https://www.facebook.com/bbcnews",
      title:
        "Half Moon Bay: Suspect held after another California mass shooting - BBC",
      description:
        "The latest deadly rampage killed seven farm workers, just two days after a mass shooting at Lunar New Year.",
      url: "https://www.bbc.com/news/world-us-canada-64382598",
      urlToImage:
        "https://ichef.bbci.co.uk/news/1024/branded_news/D6F5/production/_128392055_mediaitem128392054.jpg",
      publishedAt: "2023-01-24T08:54:40Z",
      content:
        "The US state of California is reeling from its second mass shooting in days after a man shot dead seven former co-workers south of San Francisco.\r\nThe attacks took place in the coastal city of Half M… [+2674 chars]",
    },
    {
      source: { id: null, name: "CNBC" },
      author: "Natasha Turak",
      title:
        "Right-wing Quran burning in Sweden enrages Turkey and throws a new wrench in Nordics’ NATO bid - CNBC",
      description:
        "Sweden and Finland have worked to try and improve their relations with Turkey, but recent events have thrown fresh wrenches into any hopes for progress.",
      url: "https://www.cnbc.com/2023/01/24/quran-burning-in-sweden-enrages-turkey-threatens-nato-membership-path.html",
      urlToImage:
        "https://image.cnbcfm.com/api/v1/image/107182784-1674541959559-gettyimages-1246424231-Media_Event_ID_775927415.jpeg?v=1674542063&w=1920&h=1080",
      publishedAt: "2023-01-24T06:34:23Z",
      content:
        "Sweden and Finland have taken another step in joining NATO, meaning only a formal ratification of their accession agreement is now left.\r\nIt's now been eight months since Sweden and Finland declared … [+6824 chars]",
    },
    {
      source: { id: null, name: "ScienceAlert" },
      author: "Michelle Starr",
      title:
        "Astronomers Just Realized The Milky Way Is Too Big For Its Surroundings - ScienceAlert",
      description:
        "Our home, the Milky Way, doesn't seem particularly odd for a galaxy.",
      url: "https://www.sciencealert.com/astronomers-just-realized-the-milky-way-is-too-big-for-its-surroundings",
      urlToImage:
        "https://www.sciencealert.com/images/2023/01/milky-way-analogue.jpg",
      publishedAt: "2023-01-24T05:31:31Z",
      content:
        "Our home, the Milky Way, doesn't seem particularly odd for a galaxy. Moderately-sized, spiral in shape, with a few kinks suggestive of a disruptive past.\r\nBut astronomers have just identified a quirk… [+3950 chars]",
    },
  ];
  static defaultProps = {
    country: "in",
    category: "General",
    pageSize: 8,
  };
  static propTypes = {
    country: PropTypes.string,
    category: PropTypes.string,
    pageSize: PropTypes.number,
  };
  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults:0
    }
    document.title = `${this.capitalizeFirstLetter(
      this.props.category
    )}-NewsMonkey`;
  }

  async updateNews() {
    this.props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=cf6302118ecc4bf5ba640e4c31698fc3&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsedData = await data.json();
    this.props.setProgress(70);
    console.log(parsedData);
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false,
  
    })
    this.props.setProgress(100);
  }
  fetchMoreData = async () => {  
    this.setState({page: this.state.page + 1})
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=cf6302118ecc4bf5ba640e4c31698fc3&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json()
    this.setState({
        articles: this.state.articles.concat(parsedData.articles),
        totalResults: parsedData.totalResults
    })
  };
  async componentDidMount() {
    this.updateNews();
  }

  render() {
    return (
      <>
                <h1 className="text-center" style={{ margin: '35px 0px',marginTop:'90px' }}>InfoExpress - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h1>
                {this.state.loading && <Spinner />}
                <InfiniteScroll
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.articles.length !== this.state.totalResults}
                    loader={<Spinner/>}
                > 
                    <div className="container">

                    <div className="row">
                        {this.state.articles.map((element) => {
                            return <div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author}on date={element.publishedAt} source={element.source.name} />
                            </div>
                        })}
                    </div>
                    </div> 
                </InfiniteScroll>

            </>
        )
    }
}
export default News;
