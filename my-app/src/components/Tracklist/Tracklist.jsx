import * as Style from "./TracklistStyle.js";
import { convertSecToMinAndSec } from "../../helpers.js";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { setCurrentTrack } from "../../store/actions/creators/todo.js";
import { useSelector } from "react-redux";
import { useAddTrackMutation, useDeleteTrackMutation } from "../../store/api/music.js";
import { useEffect, useState } from 'react'

function Tracklist({ tracks, getTracksError, props }) {
  const dispatch = useDispatch();

  const handleCurrentTrackId = (track) => {
    dispatch(setCurrentTrack({ playlist: tracks, track: track }));
  };

  const { currentTrack } = useSelector((store) => store.player);
  const { isPlaying } = useSelector((store) => store.player);

  const [addTracks] = useAddTrackMutation ();
  const [deleteTracks] = useDeleteTrackMutation();

  const [isLike, setIsLike] = useState(true);

  const handleAddTrack = async (e) => {
    e.stopPropagation();
    addTracks({ id: props.track.id });
    setIsLike(true);
  }

  const handleDeleteTrack = async (e) => {
    e.stopPropagation();
    deleteTracks({ id: props.track.id });
    setIsLike(false);
  }
  const toggleLike = isLike ? handleDeleteTrack : handleAddTrack;

  // через тернарный оператор ставим лайки

  return (
    <Style.CenterblockContent>
      <Style.ContentTitle>
        <Style.PlaylistTitleColCol01>Трек</Style.PlaylistTitleColCol01>
        <Style.PlaylistTitleColCol02>ИСПОЛНИТЕЛЬ</Style.PlaylistTitleColCol02>
        <Style.PlaylistTitleColCol03>АЛЬБОМ</Style.PlaylistTitleColCol03>
        <Style.PlaylistTitleColCol04>
          <Style.PlaylistTitleSvg alt="time">
            <use xlinkHref="/icon/sprite.svg#icon-watch"></use>
          </Style.PlaylistTitleSvg>
        </Style.PlaylistTitleColCol04>
      </Style.ContentTitle>

      <p>{getTracksError}</p>

      <Style.ContentPlaylist>
        {tracks.map((track) => (
          <Style.PlaylistItem key={track.id}>
            <Style.PlaylistTrack>
              <Style.TrackTitle>
                <Style.TrackTitleImage>
                  
                  {currentTrack && currentTrack.id === track.id ? (
                    <Style.BlinkingDot
                      $isPlaying={isPlaying}
                    ></Style.BlinkingDot>
                  ) : (
                    <Style.TrackTitleSvg alt="music">
                      
                      <use xlinkHref="/icon/sprite.svg#icon-note"></use>
                      {track.logo}
                      
                    </Style.TrackTitleSvg>
                  )}
                </Style.TrackTitleImage>
                <div>
                  <Style.TrackTitleLink
                    onClick={() => {
                      handleCurrentTrackId(track);
                    }}
                  >
                    {track.name} <Style.TrackTitleSpan></Style.TrackTitleSpan>
                  </Style.TrackTitleLink>
                </div>
              </Style.TrackTitle>
              <Style.TrackAuthor>
                <Style.TrackAuthorLink
                  onClick={() => handleCurrentTrackId(track)}
                >
                  {track.author}
                </Style.TrackAuthorLink>
              </Style.TrackAuthor>
              <Style.TrackAlbum>
                <Style.TrackAlbumLink
                  onClick={() => handleCurrentTrackId(track)}
                >
                  {track.album}
                </Style.TrackAlbumLink>
              </Style.TrackAlbum>
              <div>
                <Style.TrackTimeSvg 
                 onClick={toggleLike}
                alt="time">
                  {isLike ? (<use xlinkHref="img/icon/sprite-2.svg#icon-dislike" />) : (<use xlinkHref="img/icon/sprite-2.svg#icon-like" />)}
                </Style.TrackTimeSvg>
                <Style.TrackTimeText>
                  {convertSecToMinAndSec(track.duration_in_seconds)}
                </Style.TrackTimeText>
              </div>
            </Style.PlaylistTrack>
          </Style.PlaylistItem>
        ))}
      </Style.ContentPlaylist>
    </Style.CenterblockContent>
  );
}

Tracklist.propTypes = {
  tracks: PropTypes.array.isRequired,
  getTracksError: PropTypes.any,
};

export default Tracklist;