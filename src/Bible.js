import React, { Component } from "react";
import en_kjv from "./bible_versions/en_kjv.json";
import es_rvr from "./bible_versions/es_rvr.json";
import en_bbe from "./bible_versions/en_bbe.json";
import de_schlachter from "./bible_versions/de_schlachter.json";
import el_greek from "./bible_versions/el_greek.json";
import eo_esperanto from "./bible_versions/eo_esperanto.json";
import fr_apee from "./bible_versions/fr_apee.json";
import ko_ko from "./bible_versions/ko_ko.json";


class Bible extends Component {
  state = {
    currentBook: 0,
    currentChapter: 0,
    currentVerse: 0,
    showFullChapter: true,
    version: "en_kjv",
    selectedVerses: [],
    compareVersion: "es_rvr",
    showCompare: false,
  };

  handleBookChange = (event) => {
    this.setState({
      currentBook: event.target.value,
      currentChapter: 0,
      currentVerse: 0,
    });
  };

  handleChapterChange = (event) => {
    this.setState({
      currentChapter: event.target.value,
      currentVerse: 0,
      selectedVerses: [],
    });
  };

  handleVerseChange = (event) => {
    this.setState({ currentVerse: event.target.value });
  };

  handleShowFullChapterChange = (event) => {
    this.setState({
      showFullChapter: event.target.checked,
      selectedVerses: [],
    });
  };

  handleVersionChange = (event) => {
    this.setState({ version: event.target.value });
  };

  handleVerseClick = (index) => {
    const { showCompare } = this.state;
    const selectedVerses = this.state.selectedVerses;
    const selectedIndex = selectedVerses.indexOf(index);
    if (selectedIndex === -1) {
      this.setState({
        selectedVerses: showCompare
          ? this.state.selectedVerses
          : [...selectedVerses, index],
      });
    } else {
      this.setState({
        selectedVerses: showCompare
          ? this.state.selectedVerses
          : [
              ...selectedVerses.slice(0, selectedIndex),
              ...selectedVerses.slice(selectedIndex + 1),
            ],
      });
    }
  };

  handleCompareClick = () => {
    this.setState({ showCompare: true });
  };

  handleBackClick = () => {
    this.setState({ showCompare: false });
  };

  componentDidMount() {
    document.addEventListener("click", this.handleDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleDocumentClick);
  }

  handleDocumentClick = (event) => {
    const { showCompare } = this.state;
    const selectedVerses = this.state.selectedVerses;
    const verseElements = document.querySelectorAll(".verse");
    const isVerse = Array.from(verseElements).some((verseElement) =>
      verseElement.contains(event.target)
    );
    if (!isVerse && selectedVerses.length > 0) {
      this.setState({
        selectedVerses: showCompare ? this.state.selectedVerses : [],
      });
    }
  };

  render() {
    const {
      currentBook,
      currentChapter,
      currentVerse,
      showFullChapter,
      version,
      selectedVerses,
      showCompare,
    } = this.state;
    let bibleData;

    switch (version) {
      case "en_kjv":
        bibleData = en_kjv;
        break;
      case "es_rvr":
        bibleData = es_rvr;
        break;
      case "en_bbe":
        bibleData = en_bbe;
        break;
      case "de_schlachter":
        bibleData = de_schlachter;
        break;
      case "el_greek":
        bibleData = el_greek;
        break;
      case "eo_esperanto":
        bibleData = eo_esperanto;
        break;
      case "fr_apee":
        bibleData = fr_apee;
        break;
      case "ko_ko":
        bibleData = ko_ko;
        break;
      default:
        bibleData = en_kjv;
        break;
    }

    const { chapters } = bibleData[currentBook];
    const { name } = bibleData[currentBook];
    // const compareBibleData = [en_kjv, es_rvr, en_bbe];
    const compareBibleData = [
      { data: en_kjv, name: "en_kjv" },
      { data: es_rvr, name: "es_rvr" },
      { data: en_bbe, name: "en_bbe" },
      { data: de_schlachter, name: "de_schlachter" },
      { data: el_greek, name: "el_greek" },
      { data: eo_esperanto, name: "eo_esperanto" },
      { data: fr_apee, name: "fr_apee" },
      { data: ko_ko, name: "ko_ko" },
    ];

    return (
      <div>
        {showCompare ? (
          <div>
            <button onClick={this.handleBackClick}>Back</button>
            <div>
              <h2 className="compare-verse-text">{`${name} ${
                parseInt(currentChapter) + 1
              } (${version})`}</h2>
              {selectedVerses.map((index, i) => (
                <p className="compare-verse-text">{`${index + 1} ${
                  chapters[currentChapter][index]
                }`}</p>
              ))}
            </div>
            <div>
              {compareBibleData.map((BibleVersion) =>
                bibleData !== BibleVersion.data ? (
                  <>
                    <h2 className="compare-verse-text">{`${name} ${
                      parseInt(currentChapter) + 1
                    } (${BibleVersion.name})`}</h2>
                    {selectedVerses.map((index, i) => (
                      <p className="compare-verse-text">{`${index + 1} ${
                        BibleVersion.data[currentBook].chapters[currentChapter][
                          index
                        ]
                      }`}</p>
                    ))}
                  </>
                ) : null
              )}
            </div>
          </div>
        ) : (
          <div>
            <select value={currentBook} onChange={this.handleBookChange}>
              {bibleData.map((book, index) => (
                <option key={book.abbrev} value={index}>
                  {book.name}
                </option>
              ))}
            </select>
            <select value={currentChapter} onChange={this.handleChapterChange}>
              {Array.from({ length: chapters.length }, (_, i) => i + 1).map(
                (chapterNumber) => (
                  <option key={chapterNumber} value={chapterNumber - 1}>
                    {`Chapter ${chapterNumber}`}
                  </option>
                )
              )}
            </select>
            <select
              value={currentVerse}
              onChange={this.handleVerseChange}
              disabled={
                chapters[currentChapter].length === 1 || showFullChapter
              }
            >
              {Array.from(
                { length: chapters[currentChapter].length },
                (_, i) => i + 1
              ).map((verseNumber) => (
                <option key={verseNumber} value={verseNumber - 1}>
                  {`Verse ${verseNumber}`}
                </option>
              ))}
            </select>
            <label>
              <input
                type="checkbox"
                checked={showFullChapter}
                onChange={this.handleShowFullChapterChange}
              />
              Show full chapter
            </label>
            <select value={version} onChange={this.handleVersionChange}>
              <option value="en_kjv">English KJV</option>
              <option value="es_rvr">Spanish RVR</option>
              <option value="en_bbe">English BBE</option>
              <option value="de_schlachter">German Schlachter</option>
              <option value="el_greek">Greek</option>
              <option value="eo_esperanto">Esperanto</option>
              <option value="fr_apee">French Apee</option>
              <option value="ko_ko">Korean KO</option>
            </select>

            {selectedVerses.length > 0 && (
              <button onClick={this.handleCompareClick}>Compare</button>
            )}
            <h2>{`${name} ${parseInt(currentChapter) + 1}${
              showFullChapter ? "" : `:${parseInt(currentVerse) + 1}`
            }`}</h2>
            {showFullChapter ? (
              <div>
                {chapters[currentChapter].map((verse, index) => (
                  <p
                    key={index}
                    className="verse"
                    style={{
                      backgroundColor: selectedVerses.includes(index)
                        ? "yellow"
                        : "transparent",
                    }}
                    onClick={() => this.handleVerseClick(index)}
                  >{`${index + 1} ${verse}`}</p>
                ))}
              </div>
            ) : (
              <div>
                <h3 className="compare-verse-text">{`(${version})`}</h3>
                <p>{`${parseInt(currentVerse) + 1} ${
                  chapters[currentChapter][currentVerse]
                }`}</p>
                {compareBibleData.map((BibleVersion) =>
                  bibleData !== BibleVersion.data ? (
                    <span>
                      <h3 className="compare-verse-text">{`(${BibleVersion.name})`}</h3>
                      <p>{`${parseInt(currentVerse) + 1} ${
                        BibleVersion.data[currentBook].chapters[currentChapter][
                          currentVerse
                        ]
                      }`}</p>
                    </span>
                  ) : null
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Bible;