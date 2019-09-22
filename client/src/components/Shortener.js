import React, { Component } from "react";
import axios from "axios";
import { Col, Row } from "react-bootstrap";
import ReactTimeout from "react-timeout";
import PropTypes from "prop-types";

import getData from "../services/getData";
import WarningMessage from "./WarningMessage";
import UrlHistoryItem from "./UrlHistoryItem";
import UrlInput from "./UrlInput";
import DeleteModal from "./DeleteModal";

//favicon with https://gauger.io/fonticon/

class Shortener extends Component {
  state = {
    URL: "",
    shortenHistory: [],
    shortened: false,
    copied: null,
    disabled: false,
    error: "",
    loading: false,
    urlUpdater: null,
    isBeingEdited: null,
    showDeleteModal: null
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    this.setState({
      loading: true
    });

    try {
      const response = await getData();
      this.setState({
        shortenHistory: response,
        loading: false
      });
    } catch (error) {
      this.setState({
        //SORT OUT
        loading: false,
        error: "Problem retrieving data..."
      });
    }
  };

  handleChange = val => {
    this.setState({
      shortened: false,
      error: "",
      URL: val.target.value,
      disabled: false
    });
  };

  urlUpdateHandler = val => {
    this.setState({
      urlUpdater: val.target.value
    });
  };

  setCopiedTrue = url => {
    this.setState({
      copied: url
    });
  };

  setCopiedFalse = () => {
    this.setState({
      copied: null
    });
  };

  handleShorten = e => {
    e.preventDefault();

    if (this.state.URL === "") {
      this.setState({
        error: "Enter a URL and click the button to shorten it"
      });
      return;
    } else {
      this.setState({ loading: true });

      const url = { url: this.state.URL };

      axios
        .post("http://localhost:8888/shorten", url)
        .then(res => {
          if (res.status === 200) {
            this.setState({
              URL: res.data.shortenedUrl.shortUrl,
              shortenHistory: res.data.shortenHistory,
              shortened: true,
              loading: false
            });
          }
        })
        .catch(err => {
          if (err.response) {
            if (err.response.status === 409) {
              this.setState({
                // response: JSON.stringify(err.response),
                disabled: true,
                error: "That URL has already been shortened",
                loading: false
              });
            } else if (err.response.status === 400) {
              this.setState({
                // response: JSON.stringify(err.response)
                disabled: true,
                error:
                  "That URL appears not to be valid :/ - it should begin with http or https",
                loading: false
              });
            }
          }
        });
    }
  };

  updateUrl = url => {
    this.setState({
      isBeingEdited: url,
      urlUpdater: url
    });
  };

  saveUrl = url => {
    let obj = this.state.shortenHistory
      .find(item => item === url)
      .shortUrl.split("/")
      .pop();

    axios
      .put(`http://localhost:8888/update/${obj}`, {
        urlToUpdate: this.state.urlUpdater
      })
      .then(res => {
        this.setState({
          shortenHistory: res.data.shortenHistory,
          editingUrl: null,
          isBeingEdited: null
        });
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 304) {
            this.setState({
              error: "You submitted the same URL",
              shortenHistory: this.state.shortenHistory,
              editingUrl: null,
              isBeingEdited: null
            });
          } else if (error.response.status === 409) {
            this.setState({
              error: "This URL already exists :/"
            });
          }
        }
      });
  };

  // Pass in shortUrl
  displayDeleteModal = url => {
    this.setState({
      showDeleteModal: url.longUrl
    });
  };

  hideDeleteModal = () => {
    this.setState({
      showDeleteModal: null
    });
  };

  confirmDeleteUrl = longUrl => {
    const urlToDelete = this.state.shortenHistory
      .find(item => item.longUrl === longUrl)
      .shortUrl.split("/")
      .pop();

    axios
      .delete(`http://localhost:8888/delete/${urlToDelete}`)
      .then(res => {
        this.setState({
          shortenHistory: res.data.shortenHistory,
          showDeleteModal: null,
          URL: ""
        });
      })
      .catch(error => {
        this.setState({
          error: "Couldn't delete"
        });
      });
  };

  getTimeLeft = createdAt => {
    const timeDelta = Date.now() - createdAt;

    let time = new Date(timeDelta);

    let hoursLeft = time < 10000 ? 24 : 24 - time.getUTCHours() - 1;
    let minutesLeft = 60 - time.getUTCMinutes() - 1;
    let secondsLeft = 60 - time.getUTCSeconds();

    let timeLeft;
    if (hoursLeft > 0) timeLeft = `${hoursLeft} hours`;
    else if (minutesLeft) timeLeft = `${minutesLeft} minutes`;
    else timeLeft = `${secondsLeft} seconds`;

    return timeLeft;
  };

  render() {
    if (this.state.copied) this.props.setTimeout(this.setCopiedFalse, 3000);

    return (
      <>
        {this.state.urlUpdater}
        <Row style={{ margin: "3em 0" }}>
          <Col>
            <h1 style={{ color: "#363636" }}>URL Shortener</h1>
            {/* <h1 style={{ color: "#363636" }}>{this.state.response}</h1> */}
          </Col>
        </Row>
        <Row style={{ margin: "0 0 4em 0" }}>
          <Col>
            <p style={{ fontSize: "1em", color: "#363636" }}>
              Paste in a URL and click the button to get a shortened version
            </p>
            <p style={{ fontSize: "0.8em", color: "#6e6e6e" }}>
              ( Please note, links only last 24 hours :/ )
            </p>
          </Col>
        </Row>

        <Row>
          <Col md={1}></Col>
          <Col md={10}>
            <UrlInput
              copied={this.state.copied}
              setCopiedTrue={this.setCopiedTrue}
              URL={this.state.URL}
              handleChange={this.handleChange}
              disabled={this.state.disabled}
              handleShorten={this.handleShorten}
              loading={this.state.loading}
              shortened={this.state.shortened}
            />
          </Col>
          <Col md={1}></Col>
        </Row>

        <Row style={{ textAlign: "center", margin: "0 0 4em 0" }}>
          <Col>
            <WarningMessage error={this.state.error} />
          </Col>
        </Row>

        <Row>
          <Col md={1}></Col>
          <Col md={10}>
            {this.state.shortenHistory.length > 0 &&
              this.state.shortenHistory.map(url => {
                return (
                  <UrlHistoryItem
                    copied={this.state.copied}
                    setCopiedTrue={this.setCopiedTrue}
                    url={url}
                    updateUrl={this.updateUrl}
                    displayDeleteModal={this.displayDeleteModal}
                    saveUrl={this.saveUrl}
                    editingUrl={this.state.editingUrl}
                    urlUpdater={this.state.urlUpdater}
                    isBeingEdited={this.state.isBeingEdited}
                    urlUpdateHandler={this.urlUpdateHandler}
                    timeRemaining={this.getTimeLeft(url.createdAt)}
                  />
                );
              })}
          </Col>
          <Col md={1}></Col>
        </Row>

        <DeleteModal
          showDeleteModal={this.state.showDeleteModal}
          hideDeleteModal={() => this.hideDeleteModal()}
          confirmDeleteUrl={this.confirmDeleteUrl}
        />
      </>
    );
  }
}

Shortener.propTypes = {
  URL: PropTypes.string,
  shortenHistory: PropTypes.array,
  shortened: PropTypes.bool,
  copied: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  loading: PropTypes.bool,
  urlUpdater: PropTypes.string,
  isBeingEdited: PropTypes.string,
  showDeleteModal: PropTypes.string
};

export default ReactTimeout(Shortener);
