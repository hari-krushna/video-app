import React, { Component } from 'react';
import '../css/custom-style.css';
import $ from 'jquery'

class Video extends Component {
    constructor() {
        super();
        window.video = this;
        // Initial State values
        this.state = {
            width: 500,
            height: 0,
            filter: 'none',
            streaming: false
        }
        this.onChangeFilter = this.onChangeFilter.bind(this);
        this.onClickPhotoButton = this.onClickPhotoButton.bind(this);
        this.onClickClear = this.onClickClear.bind(this);
    }


    componentDidMount() {
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const photos = document.getElementById('photos');
        const photoButton = document.getElementById('photo-button');
        const clearButton = document.getElementById('clear-button');
        const photoFilter = document.getElementById('photo-filter');

        $(document).ready(function () {

            // Get media stream
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(function (stream) {
                    //Link to the video source
                    video.srcObject = stream;
                    // Play video
                    video.play();
                    // video.on('play', function(){
                    //     console.log('Video started')
                    // });
                })
                .catch(function (err) {
                    console.log(`Error: ${err}`);
                });


            // Play when ready
            video.addEventListener('canplay', function (e) {
                if (!window.video.state.streaming) {
                    // Set video / canvas height
                    window.video.setState({ height: video.videoHeight / (video.videoHeight / window.video.state.width) });
                    video.setAttribute('width', window.video.state.width);
                    video.setAttribute('height', window.video.state.height);
                    canvas.setAttribute('width', window.video.state.width);
                    canvas.setAttribute('height', window.video.state.height);

                    window.video.setState({ streaming: true });
                }
            }, false);
        })
    }


    // Filter event
    onChangeFilter(e) {
        const video = document.getElementById('video');
        // Set filter to chosen option
        window.video.setState({ filter: e.target.value });
        var myfilter = 'none';
        myfilter = e.target.value;
        // Set filter to video
        video.style.filter = myfilter
        e.preventDefault();
        // console.log('onchange fired')
    }

    //Take Photo and place in canvas
    onClickPhotoButton(event) {
        // console.log('button clicked');

        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const photos = document.getElementById('photos');
        // Create canvas
        const context = canvas.getContext('2d');
        if (window.video.state.width && window.video.state.height) {
            // set canvas props
            canvas.width = window.video.state.width;
            canvas.height = window.video.state.height;
            // Draw an image of the video on the canvas
            context.drawImage(video, 0, 0, window.video.state.width, window.video.state.height);

            // Create image from the canvas
            const imgUrl = canvas.toDataURL('image/png');

            // Create img element
            const img = document.createElement('img');

            // Set img src
            img.setAttribute('src', imgUrl);

            // Set image filter
             img.style.filter = window.video.state.filter;

            // Add image to photos
            photos.appendChild(img);
        }
        event.preventDefault();
    }

    onClickClear() {
        // console.log('clear clicked')
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const photos = document.getElementById('photos');
        const photoButton = document.getElementById('photo-button');
        const clearButton = document.getElementById('clear-button');
        const photoFilter = document.getElementById('photo-filter');

        // Clear photos
        photos.innerHTML = '';
        // Change filter back to none
        window.video.setState({ filter: 'none'});
        // Set video filter
        video.style.filter = 'none';
        // Reset select list
        photoFilter.selectedIndex = 0;
    }
    render() {
        return (
            <div id="showcase"className="container-fluid">
                <div className="top-container">
                    <video id="video">Stream not available...</video>
                    <div className="row">
                    <select id="photo-filter" className="select col-md-3 col-sm-3 col-xs-3 col-lg-3" onChange={this.onChangeFilter}>
                        <option value="none">Please select</option>
                        <option value="grayscale(100%)">Grayscale</option>
                        <option value="sepia(100%)">Sepia</option>
                        <option value="invert(100%)">Invert</option>
                        <option value="hue-rotate(90deg)">Hue</option>
                        <option value="blur(10px)">Blur</option>
                        <option value="contrast(200%)">Contrast</option>
                    </select>
                    <button id="photo-button" className="btn btn-success col-md-3 col-sm-3 col-xs-3 col-lg-3" onClick={this.onClickPhotoButton}>Take Photo</button>
                   <button id="clear-button" className="btn btn-danger ccol-md-3 col-sm-3 col-xs-3 col-lg-3" onClick={this.onClickClear}>Clear</button>
                    </div>
                    
                    <canvas id="canvas"></canvas>
                </div>
                <div className="bottom-container">
                    <div id="photos"></div>
                </div>
            </div>
        );
    }
}

export default Video;
