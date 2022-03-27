import { PauseCircleO, PlayCircleO, StopCircleO } from '@react-vant/icons';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
import MediaStreamRecorder from 'msr';
import request from '@/service/request';
import * as qiniu from 'qiniu-js';

function Recorder({ close, uploadCb }) {
  const [width, setWidth] = useState(320);
  const [height, setHeight] = useState(240);
  const recorder = useRef<any>();
  const mediaRecorder = useRef<any>();
  const [status, setStatus] = useState<'start' | 'pause' | 'stop'>('stop');

  useEffect(() => {
    setWidth(document.body.clientWidth);
    setHeight(document.body.clientHeight);
  }, []);

  function captureUserMedia(mediaConstraints, successCallback, errorCallback) {
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(successCallback)
      .catch(errorCallback);
  }

  function onMediaSuccess(stream) {
    const video = document.createElement('video');
    video.setAttribute('width', `${width}`);
    video.setAttribute('height', `${height - 100}`);
    video.muted = true;

    video.srcObject = stream;
    video.play();

    recorder.current.appendChild(video);

    mediaRecorder.current = new MediaStreamRecorder(stream);
    mediaRecorder.current.stream = stream;
    mediaRecorder.current.mimeType = 'video/webm';

    // don't force any mimeType; use above "recorderType" instead.
    // mediaRecorder.mimeType = 'video/webm'; // video/webm or video/mp4

    mediaRecorder.current.videoWidth = width;
    mediaRecorder.current.videoHeight = height;
    mediaRecorder.current.ondataavailable = (blob) => {
      console.info('blob', blob);
      upload2Server(blob);
      // var a = document.createElement('a');
      // a.target = '_blank';
      // a.innerHTML = 'Open Recorded Video No. ' + (index++) + ' (Size: ' + bytesToSize(blob.size) + ') Time Length: ' + getTimeLength(timeInterval);

      // a.href = URL.createObjectURL(blob);

      // videosContainer.appendChild(a);
      // videosContainer.appendChild(document.createElement('hr'));
    };

    // get blob after specific time interval
    mediaRecorder.current.start();
  }

  function onMediaError(e) {
    console.error('media error', e);
  }

  const start = () => {
    if (status !== 'start') {
      captureUserMedia(
        {
          audio: true, // record both audio/video in Firefox/Chrome
          video: true,
        },
        onMediaSuccess,
        onMediaError,
      );
    } else {
      mediaRecorder.current.resume();
    }
    setStatus('start');
  };

  const stop = () => {
    mediaRecorder.current.stop();
    setStatus('stop');
  };

  const pause = () => {
    mediaRecorder.current.pause();
    setStatus('pause');
  };

  const upload2Server = async (blob) => {
    const file = new File(
      [blob],
      'msr-' + new Date().toISOString().replace(/:|\./g, '-') + '.webm',
      {
        type: 'video/webm',
      },
    );
    const param = { ext: 'webm', type: 2 };
    const { data } = await request({ url: '/upload/token', data: param });
    const { key, token, bucket } = data;
    const putExtra = {};
    const config: any = {
      // uphost: 'dqqn.fushuhealth.com',
      // upprotocol: 'http',
      quality: 0.92,
      noCompressIfLarger: true,
    };
    qiniu.upload(file, `${bucket}/${key}`, token, putExtra, config);
    uploadCb({ key, bucket, size: file.size ?? 1 }, URL.createObjectURL(blob));
    close();
  };

  return (
    <div
      ref={recorder}
      style={{ width: '100vw', height: '100vh' }}
      className={styles.recorder}>
      {/* <video muted={true} controls={false} width={width} height={height}></video> */}
      <div className={styles.btn}>
        {status !== 'start' ? (
          <PlayCircleO fontSize="30px" onClick={start} color="#ffd340" />
        ) : (
          <PauseCircleO fontSize={30} onClick={pause} color="#ffd340" />
        )}
        <StopCircleO
          fontSize="30px"
          onClick={stop}
          color={status === 'pause' || status === 'start' ? '#ffd340' : '#aaaaaa'}
        />
      </div>
    </div>
  );
}

export default Recorder;
