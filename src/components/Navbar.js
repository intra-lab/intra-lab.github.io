import './TabSlider.js';

class MyNavbar extends HTMLElement {
 constructor() {
 super();
 this.attachShadow({ mode: 'open' });
 this._tabsData = [];
 }

 static get observedAttributes() {
 return ['brand', 'logo'];
 }

 connectedCallback() {
 this.render();
 }

 attributeChangedCallback(name, oldValue, newValue) {
 if (this.isConnected) {
 this.render();
 }
 }

 render() {
 const brand = this.getAttribute('brand') || 'Guest';

 this.shadowRoot.innerHTML = `
 <style>
 .navbar {
 display: flex;
 justify-content: space-between;
 align-items: center;
 box-sizing: border-box;
 padding: 2rem 4rem;
 color: var(--text-color-primary, white);
 transition: background-color 0.3s, color 0.3s;
 position: fixed;
 z-index: 100;
 width: 100%;
 pointer-events: none;
                         font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;

 }

 .nav-bg {
 position: absolute;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 z-index: -1;
 }

 .brand { 
 font-size: 1.3rem; 
 font-weight: bold; 
 }

 .toggle-wrapper {
 position: relative;
 display: flex;
 align-items: center;
 overflow: hidden;
 }

 .toggle-text {
 position: absolute;
 right: 10px;
 opacity: 0;
 white-space: nowrap;
 font-size: 0.75rem;
 color: var(--text-color-primary, white);
 transition: transform 0.4s ease, opacity 0.3s ease;
 pointer-events: none;
 z-index: 1;
 font-weight:400;
 }

 /* --- Updated Button Styles --- */
 .theme-toggle-btn {
 position: relative;
 z-index: 2;
 background-color: transparent;
 border: none;
 cursor: pointer;
 padding: 8px;
 display: flex;
 align-items: center;
 justify-content: center;
 border-radius: 50%;
 width: 48px;
 height: 48px;
 overflow: hidden;
 pointer-events: auto;
 }

 /* --- Sliding Icon Animations --- */
 svg {
 position: absolute;
 width: 32px;
 height: 32px;
 object-fit: contain;
 transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in-out;
 pointer-events: none;
 }

 /* DEFAULT STATE */
 svg.active {
 opacity: 0.5;
 transform: translateY(0);
 fill: var(--text-color-primary);
 }
 
 .theme-toggle-btn:hover svg.active {
 opacity: 1;
 }

 /* ANIMATION STATES */
 svg.exit-down {
 opacity: 0 !important;
 transform: translateY(25px);

 }

svg.enter-top {
 opacity: 0 !important;
 transform: translateY(-25px);
 }

 .nav-item { 
 flex: 1; 
 display: flex; 
 }

 .align-left { 
 justify-content: flex-start; 
 }

 .align-center { 
 justify-content: center; 
 }

 .align-right { 
 justify-content: flex-end; 
 }

 .theme-toggle-btn:hover ~ .toggle-text {
 opacity: 0.5;
 transform: translateX(-45px);
 }

 /* --- Mobile Responsive Layout --- */
 @media (max-width: 768px) {
 .navbar {
 padding: 1rem 2rem;
 }

 .nav-bg {
 backdrop-filter: blur(10px);
 -webkit-backdrop-filter: blur(10px);
 mask-image: linear-gradient(to top, transparent 0%, black 40%);
 }

 tab-slider {
 position: fixed;
 bottom: 0;
 left: 0;
 width: 100%;
 z-index: 9999;
 display: flex;
 justify-content: center;
 padding: 2rem 0;
 }

 .brand {
 flex: 1;
 justify-content: flex-start;
 }
 
 .toggle-wrapper {
 flex: 1;
 justify-content: flex-end;
 }

 .toggle-text {
 display: none !important;
 }
 }
 
 #sunIcon {
 width: 1.5rem;   /* smaller */
  height: 1.5rem;
 }

 #moonIcon{
 width: 2rem;   /* smaller */
  height: 2rem;
 }

 .logo-image {
 width:8rem;
 filter: brightness(var(--image-brightness-filter));
 }
 </style>

 <nav class="navbar">
 <div class="nav-bg"></div>
 <div class="brand nav-item align-left">
             <img class="  logo-image " src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVsAAAB0CAYAAAArQpG6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAH6ZJREFUeAHtnbGb2zaywEf5rnD39jp3x3Tp3qZzd0zn7nxduihdujh/Qdbd6+J07lbXufNe505Kt533OndiOnf2da48jyMMViBEAAMQpCgtft/HXUkkQBAYDAbAAAQwWDg+52OcWAuaM8vfsxcX4QOWajMh0swuhXIGlEIsFMKUelJIogjObClFUygUCufGuWr20mIVCoUORSmcL6VsC4VCYWSKop03cymfxcDzI1JEuFAoFAqFQqEwNsXmLBQKRREUzpEi1g+SUuyFwtlRqnWhcFrMsc4WPXLGlMItnB1TCXXKfUqFO3tKEQcpWVQ4O0ioEYaDiFX77+f2uOSfmvZ4sVgsGigUCnmZVWtUmkbFYqcIL0gZ6uOL+n8BmWjj+qE9PmI/z2GGFPGYNwfl0woSteLPvIEWiyvIcusc9sepM6N8mHGRtHJZt//+3h70n2TUp1jv+Ph3e2xaef0Ecfeq2n/bwGXftfFurHDPA+m6acPcmT+MmeVtepbtv8pzycZ+hrNnTjJOBYQBoFCYALZef/VYmFKuWYFK7/tSEmdPuG0gzBImpL3fOpCeKxiZYm3v+QqOQSmBQoBWEdBYKVmXV+C3FiUsKa4Ipfu/gmsqKATZWWalvu84jrKd3DYupX0qoBp7XbcfX8JwJWuzbA+y9i4D1/0JhXyUvvCO4yjbyTlGaT8kBZ/nWdnqJEVbw3hUEFa4KwjzLyicL4vEcx4eiLI9Bg+pOQ89a1g6DUVbwfiQxexUuDxp5FOm/2qvWcFD4SF2DDHxnIejKtvSuZ+Io2e0SDrfgEvRjtNukcJ9g4a7WOeFp4vFsv33ApRvrYa8Gl7wuYdDGQbIwlGV7YMuwykV4Mwzmmfp3d36bl5t2uOX9vi2Pf66MODffuRrJFTtce8za2cTuTi2x9ftx93Rfv5rktvjSQh6MX0mB4vrV2FiBC5TyNfUEXFWwng/YqbFEFhcvwoeypht4aiwAq0ClzXQs4jABy+pJUv3LnApKdpnUDgPZmygz1rZlo7Ng0Ci6JL2I+CVY/8ENdbq4++QShHSeTHjfvdfYEK4u0aHvdyyAVUhGnNp5Rj5hmrWWx+d+9tLKcfAkQef9DFFGox0VHzY6biLXeI6gNACgmbIzD8p6fZZybPgZ89lIb9bN5mE1CgPnZZjlEUUKTKUdbXsiEtvx4h6dGXL3cR/wH5Ne+h6UjYbUO41gxUPK9cfQLCmHtVw9AZU1/P3XLs7YXddfx24VqeB1vXf5NxhysqLOnBtA7y/wMhuTlXg/H9gOBvwK9vK/IJ7NzQf3+UoG5aNX8Ejm0ad+H1x5B3HULnLUX1+BoH63FeX0X3tc/CXEfFjZygpUhvyGPUPgcv+SWmdxEDGTBNkJESCAXqLL/YPa4xY0z78/pjt/hnTcD0kDZyO3aosTGeLI03uYHhS6RoGgmqPhdp3WNdXGKZKeJallaY3GM9vKJQHzDhBhgcy9AUjWaNnghNVfoR4CQNow78LxL+FQSziTuNAZcuZ9hvm5VeIYAb3HzUPYoYJ23A/Yz62OFDx96RvG7onTAyOrGxR7inhzBMUlANmUraYV4aoXlwkpjdZFlBUpl+uYEpwgLJFpWTcrUd0Y9gJ82tIy/D91zGRRiCysFAVaqgFTeU3EILpllMIcpVKH+M8TKckr2qYEBxf2YrkIyClgXJYDFS2Cy1D15ifLfbn33NB2CTZQ4Few8yGhE1ubwQa55I6p8vYh7lqpe85hO9fQ0SkEVBheZUdqhbbnwfDIGEM5YGG0jGGS5Na6volm8L9Q3DN9dgVYSpQ9VBEeReQUr3kuHLcCYaxC0+r+paQnwpU2m0LdwVhz5FUmQ6N1W7GHg8frmxZIjC0CqjLzvMA9pNR0tlW53hVjBAbNBAHKbvac57SUMG4afgt1Lpzo5BmARh/PVy05f4G8ywGuBFcU7XHO5zpGxIi+BuoLSMTOSiX3ZJjyM5Cy1AN41GBlXb2XghNiovc9MyGiuW0DgSZfmMhTBxGQNkY1BrVhMRFT3jpZNKbnrCSbp++Pz1f1RN+KX0Gx/Nfooy1Iw2XQ9MgLT8rLdSAPEOV//T/JcrHE8XDGj4wbvxyy2muYCRwvGGEPmg44CU/05L/ryLjunI8xzoxnFSGthQHKtm94LD0+Rk/g4Tn1r1rQZioRh5nMISQnLCeMJIMuhLe/2p3tX/A6sIKc42C+4cGD1A+cVH1hF0LwgUts4M0uPPhIhjWDV1Tg6Qcwgy2blFVzhTI2r3m8BVkAqdRtqRknwfSIS2D3iXHmKBsUY3TbjFMvCwL0s73D72ZI6qHg/bcxWGdWsNQUkYmMU3ZhoQiahYRw0KyNK6VuIxcRdxbUtGeDw0TSIOk8XrWE+5XQbgtyl2HJBMWV5ABlL2KJoSpfJMbAcymbJ0t5RblZRCsj8xVT9h1QhhJmdcgBGUK165PIVmIUo4YVt5LOAaYpmxXgSBRvpLYVTZbVEJzjfvu1qVx7QWnmRQ+tWDvrMyNdhfBsJC+tK6/4HS9dKQh2lcUwwJ6dRjmSygMna8gAgyX7XCrYH+vHAq3kzbsGbIRpGNsy7aGCFCmALc94daBMFcJzxA9bo7hIba1dX3I2BBvHpQzruzgDJQtx1nBAHDvyB49UYThSi91A9NpqEDKfsIxKk9R1hVfQiQoUzzZhBXlXedYrlFuTY6pbJMWaaBsmOoyMsyVdX1IhqIMF2uSKiTPdtpD1mgNAjA8xDh40YyUXK5fQXcNjFSeQ90waGaTlvYlLvkNPU8FcWloQEq6x84/AueT9hjgtG8Cl2VTtrxf7Ncg35NWyhLUSx+jFqiMwO+QhiRcDcMIydALiMAS5VXg8tr6HnpeqQtYHTg/mRdCLmUr2cZujRM7pw8gJHRTIHJxMagD5zeQDu2c9bXnkLruiSAF3x7ftR/pkLiGxUCW8xbxCLPPqsFLafyJDYTzWfJWYB+hXmByWez3NHBaE3baN+Cn4zfbNz/F1nIFbpqYbTuHkkvZSn0lSeHS0Rl3nQOouvxkgY+5KCGUBuq+LjkNVUS4C8H1/4ZE2EJvPEdWZWvcl3oFWtH/CDENhr+HUIHsLbu52UAiQh/U5OdhGfKFz7H7WOOZtu/cm5Wg73kvTOPNUdwh63cDE5Jl1y8qhPbBNyDrxtT6ujaMFiA6aCXRXW+XO8N+Z9jdwo7+k4N53xZxyYSS6UmD3vFJkAaEHoGVVLIGThSWiRUduHdQp4Os//5nD7viVKDeQZZl9y4hQ3cwo/C153wF6YRkqMLhk6FV5DkyEHzpqsGvMEM91EkXMuTcYpEsj3cQp7TMivOcfkBjaz/QS+gSFC1XyiWo7kkNwwRRdk84SEMFqnXV2ytmGNvs1SIVhEJNtE/u2LB1dcMHGMpX53Mlj213LU2QfAfTMLQMPOF3jfAQ+boQnK9hPO7vbxgtL0GtynRByvSq7wTXPZ+innQIgci2NwJbBz/CcCpQFYcqwRYjtxhEXonWfvzYHrTCaQkTKFpHGracBnqeDIo2mVG6+XOAhzho398lv5yRFCdZLJ1nPmgI9x+prJZw8qhGGNM9Q44pnx102XDDuvFcernXDQdGSA1+JrVqiawb0ZDQg3rvUwP5WIJSusFNYFAt5RVuRpMfHnNdHyENVeD82SpbGx7nXYKSw/vZc7sqWt9/gNNAUo6zUZqZCM018LjsQfc3VKYrmJjs7yDj7qoW9AbyQZNq79CxTBXUEMYzGE4DCd093O/uX8NwNpFpOG9lGh5/PQyiJu6uQNbbivOFPh4SRXqysuAo5hX4ORiXxfDGM6Pv8NXHKK/FYfP/CpSbzRL2kxkVDIPGYMh6tcfY3iTG3YBSan/y/w2/s+oK4md2ozwImE989KVhBXG7qPmo4JQZMDlKvsWsSEP+tTWMb+2MbnWO5RkCezkdjb5iFky+U0N5YT2361rN5EMIxOjvIGNHejpMv7ca1MSVnoWPYTfGph30Ub61IxUGZfK9QhOEEcGO8pXgUp2GDbg8L9IIVjBSOMdozWfCSwgr2woy0Osrsmeosq0C54co2lDYO/Z9PgZUZ2rPeerRrozvIS+EDRyBSd+uy0MMdNzo31gB06FfIhcE1XjMir9KVgTRkMZLs/XL4E1msgycp/u+aO//EsZBYnFQHjcwE7irF9qL9ZccXhRsHTXgV1Z/gwwERjxie0s2oYUuDaQTyucKjgfpC5qzcTVWlC8r43sNbjbHMjomVbZ9GApYd/euIDC4veCuQ1tltd+qj1/6lFwuRcuO1VXgsh958nAUeNiBFLrPcqoh/2qsgVDeedUTKSenErhvMDO3nDlwWLghZRniMmA6/wmJCGSoMrvrU2Y5N5Y0UebSC2Sk7cbmBfXxKEMIRPYJsiHwpMYSxCvSFlXgmk2iNRnT3asC5/+dqGj/B+IIWSbJM+6odjLbeo5oi01V2uD4orc7iAcfHNepRrzyX5WuqPpw6MNLTH+HlnIf9JvOQ3sBofD3aT9C27bynDNXk/nkXPtoH4XRlC27QV0mzvJKNt2QWLX/SZnJhrg15lXgfGoFiK2UIReZzvJGKcbCjMpzNJDGJnA+16bgkoZm8HCFkJ8hDUm4DQzjj8B5yZCdEzTe6BALL0DwNc56CLL2XHMz4gRikK/SdNEe3k/g2rJ+qOEjh35yx0p5dUq+DIlsgrly1zApCzsNWrnFsBJcc30g7GEBCCmqIWvmQ5WbGPSuM2NoKkQD07CMtW4Njx4fOVZErQLna0zcTIqfgfQBbZ34kd0416w7roTx+oYAfsDwxjPDhxAGKMyvMnQHKlATRKb1Y5JinUiEUWKJpOyCtI68PqRoBBMv+1JgxRLdQAlW2xDVQdweARAqqjSLUAntSnAlycK7FAuXK/A7waVDduNK4U3neTwVWOi2RmxgIMLtNK9jy2K34Kj7DCTjVK41KN0hfVmrbwggVG/yLM/NOX6CkZuHo+y1NAeLERbu+1fKOva+hOwdXyt5yWIN8me/RhlrI0xow2VqxSvh/Xer4HahvgTTcN0Tvt6f9kbwJpQmjmuLYSoYAMo2xb5/Zsn9UP7yUM3SCh+xefjCDLdFOVvMVwaIae/Fu3Lcc3Darbx8J4hTGt8W07iGuYFpb2pYY5gtetago1I0P2N4h3bU8aDs5XBbDKx9RyVgEoHQrK10h9hizzvDetKwRTnXjnikr5bZolJe7NlxXzF220wK4xj8Gm2+p6TM7bRTg0Gvdb/i4zf+LTouR5pCVD3hthjPNao8381v4P4ty2t5FE5ZCMVxlRjOTPulIw6qF7+irDzEihDT3+RRw5E5MDBRKSbvw7fm+MIKU4O8+92A6nrS//+CmnWvQL4rFoX7Vo8TolppJZkAoXDUDTG3udMLK+r+IE4/m43p4I1K+dYQZgNqnLKx0lBD/ITYqk3Dj/aPqBQnWf4VjM/XOXwWUb3XSnUB/a5NY/Cd3b1EpUi3gXAHz45KcVeeMCR/3kY3gQbUMzT2CYFcvuAlzXa4CuJWRNqryyqIC/utVI6EZWPT8CZF8wITLFsOl/tlfS5q676SoYRY3rhP7brnsS+oy5yGHc4GEVWexFp4sVxBRnA6+Qk+A45n2cYOb0hwKm9MtGw57BQyRCwhXlbWGMcVzICcWyySdTK2w/CPthXCExsvIB9kfXhczw7NLk5T6rul+vgdBsTHeUKWdwPj0GsRDYHl58WEHpy/5H6GIOrRqDeSy9vmxViLZQwZGtNV6sVC8l68wyoX+9aRFcwRTLRsjfBjWCjUwtYT3Hc3kYdhS3XtSMMKM6SB4wqlITjOhfeTjVl5DiOCSv62OB5bDMvSaJYtX5fDagyWAw6wbK282GJe6NmTh1MwOE/SmRyO9S4ajTG2WCQhoNa7gTyQhfd1yG1jbxklQxbCd0Ocnnn125A0/N7G8S1kglfkfQ15LP8NqLG1lzAibOnoDcBzstufAtQzbOCIGNuQNhDPLuzY5aDJLEPEClT6ky3ysJtjxxQeu7edDg60bHviSpohRjXrKJkws+9JLfEq4p5rPBwHTrJse9IgZZ2QhihXFty/THKLcj72pe2AkSa0jDSvMQ2dfopDLEs4smVrXE8W2hXKymSNkeObmMGy7ckXyssYzx3iIz9nBZlA9dJYCRXMhMnmfVEJGs24k9D3Ofr/Caqlz7YrD9+zVvejyrZ7R1MDygviDkbeAQj3byytVRruZ2gbIw2TLyHE/fuZLuGwLP4Le4+Ru8URlzfa4H6TETr0yzK1Em34v5aju8UJvXfNqB8V7PfF0M9yM6dyIAIyRDjqc54tbLhufQxc1vEaKsyOaf2Ozos55915lutDlVaUeQAtoTBvirot2DxUmZjrc6NjteeX7tBF9DBkoVAoFBiUrTqc3/LcQqFQOCVQtodJ3Q1V+qsPl3Mt+yLT8yCqHOZXaNj/Fm3y3vhNoGhjl/NOwtFfi3N65JlNndtrXLJxrs/lo1ckMslJ6v2jbp2WzpGf8BkPBWz4O3lj1NCzf0rPdhq5fIILhcK58rA6Bu6nxfDeIJNataXDVigUZsHC8TkVTF/OXIE0oZEUhVuYLccXzlI90jhuvmH6LnpLKBQKBQmLgw8PD5S/MUXz8YEq2hOVkmIEFc6AcxBjjNu/Y40z2v/AR1Ex90w4e1woFHrBL3jRVkXafvEfoPaJsN9got8K8QeovQ82cCIUZVs4CqVpK0hB5XNLx6e5bchTKBQKhYwUq7RQKBQKhUKh8JAp9nBhDIpcnTelfAuFQqGQQmk/jkTJ+MKxKLJXKERSKs0cKKUwlJPKwVLchUJeUO1lWl5zUjhZFtq53HAcDvF5sVh8gBOkfcZH7b/Hxk8f2mf5DGdE+4z0fI8El57Ms7fPRCuK9Eqik1o1NDfKYpLj8Rcj4/Urt4O0wk//9KvAT2lFBymipfH9ZXvsFc55SOJT2L8y3UtbjtRovgfJK8upWUZ/5oyRfbh/Zbamhv2G0oVIphTvoti7DHlTw+6d8W1lOB9LI1YyRpCmNj+/af99c3+LxeIGxuMxH3WwHDH8oCNVLLsXVZZrnghF0XbxKVsS8r5uZmV9p4pKQwu34OBsW7hxHoqUn2nJDVG2VH62sqIhhgs4HGqgcrwYWblHQ0Mdbbpeg7Jo6XneQiEzxQadAp+yfe3qWrbC/wRUd1VDFfXONQY4/2I8W2GjcdlV3wke273kQyveS244Z6XQ2vTQUMd7GImiaqZ5+oeez19BAmzFmhWSKusTOFkSReCE3U5okpOV6ivods2fHGV/0CPmZbHphiAvuDz5fLqVLnnMlhQuqneza6uooj88428q3lvuCtJ5GovUXdjXpiXM4ei8OZtO5xu2bIJwHJfQ9Tig8HeCsLUVpvFc+8RIo/NafmY9LqrZTUrZvQbj/pXjd++9UqF0tPdYtR9/gv0z1e2xcoVxPFfD6QuOqTrCU7j3fZ4u7fVUptpT5oNLHgwZe2TEeT/5Z5Xb/b08v1NclXGut+wcaemTRW/4vnQY9UnXi1tpfZiGqZuq+TaNIct96KvMqdD1+KKuDCQQtXHNHQtRbYWl63bK1jjf57JElhYJ58anND1xXLLCWoGf2vi8AaU8XNC9LlzXshsduStVjvBPadgFut4cNQxPVxKscG+Ne1WkuGzFHniuS76Gnutt35ASD134vCXqnnzRceswdP69FW/F6bpwxPmWe2NmuVH8WrF3fqehFFBeK33xPfVNJrJyfAqHm16b4bvPuK+ldjqA07GXadyV/4yU7fkSO+wRuvar+1jHw+tSxj6UJJw+39BdJbesPDOOOhAHhV+CzP90EKyQlmBbqIeXUr4sj+Ko31/e9gTnY/N6VpRk/Vbgh57rJ1Y693D4pTD80g7vgq3PJfh9xJ9GDI1cCOKruXG300JhKI8uwU+37NGZju/BltmyYmoyctvQfxkYqymQLgd5LZQNH5843GdWkqZgkqVxy9fpBQi1cZ8DzwfuYtZWOm5h701xYcRRQw4ov3qE3lC0Zr7sLLGFem7dtTR7A9TYrGBveZvnAboWeW/3M5qe8uahHsozrWQrYAW8e1VJt+LrPH4P+zy2n+t7K+194e/YqtbhayM8yc0GfI+hwj3Vj8RF0nDcWh51up6BrLHVQ10NqLLT5VZDd0igb1J4CYdlr+PoyyNSuK8cE8s6HZ85jg+cjg9QOEmShxFY0CvjJ5cQkIAcdLs4fG2FX1mCR2NWDXSF2BZyMw767VXPmBgNZVBl/wZy4LYuzG4g0dfdbHhYpObvnS67bYH5x2izz++ayrajWKDb/V5ZeUyfG1bWT/m3++fiZzLz5cYcd+S4NtxtrvlnKqsN+Kl1vFwkkvwO8dgRz/s2Hno2bTzoOQZShPa4MnFjDXvpPKKGYAl7FzwKd+tIRwPW3EbhdEnyRjDGpUxc40h3jvGt2vreK1RcEW+Mn7R1qLuQpoC/9UxeUBxjC61pkbqeG/h3M52JjUD2yYK+cVatEDTOVYPc42iMn1zdaVfDTOFX7fF/bVyvIIyZb6H8bvT3QK598izusH+3GyTNrWt+gSffTOXqKvud3BdFez74LNsLPFw1RIqugkML7pNnhtT1e2V89i4XZeuoMcKQgJLAVmaP3jeBxt3kOxjJRY0Vv9lNvQsEeQXdbvUc6EuHqVA+Czw76HzFnytHvFQGb+2ArFgaEMDWspnfoUmjDfBS7cCwpzOenqGWR5wW+m7Wh1vwQ3lU82fqATzqUaofJF4PhdPBp2yXIGPXrfSc77OWdBdK00AYEvKKP993dRfxcYyFrZQa38VcueZmtfSNaVbG50+CiSYzDtXFVy5MetySeMKNEymdBtI2xXlsfW8C10vL/nPCeXvuIrRD2aOe8Hb6ytjsmTHU9asB1dWJbYFtQZSEN4XvkfX/IA7HaKbgPo7ZrzAdSx9Ok75nMPNYexSI4SXAFNdr6HqEdMbsueey62IL5clM1+eQsmar9DOEJsmkIzNdMXlspWsJcTyCwtnjU7Z9Av+Zf6fj/SLdwT6XcDnjSR/NfKC+NeqxO9Y5ZIStWxo6qaF/LLfig6ze28glw9K0hpWttPhHE5Pkxr4wc3zKdjXimJEdr0T59l0z18mDk7NU8MvBuGPf2CVZnjFKEEwZ0pOdtCgAlGKvjP8mT3gc88YTtVn2vi47JFwXy2fr82uIw+i1PQBF+0A3SRg6jJCKrSQllcC0uj4Y/02/UA8LO44h9ClTc5jjwjHpMWeeWN8b/t95hkWG5cKsdHe9I/2b4S+tZUFv3+lq8Dvp6lvxZp3PVfahtOx8YZPKPsKoDemrWeuzB7oZRZLr11B6Zp2/EQSrjM8frP/Ehb9CYeg+doXpj8X9JgR7QsP7TKRcaFEHH5LnHw1eDWW7rWklZ1q4j3eTmyMYX+zlYFuylSeIbXlfgp8nMB6N9T1NsUfkKw48X5ieoyhbpjE+V75ZblYGfV3cvYJT0lV74iCFVoEb04K69CwXra2Yd3/ZqjIVdu2Kw1jQoY+8Y6URNQ0Pt8uk+2+M73olnqb2xU+O/+1BK6Oe6UaE7sHfn+8WBriVyufA93vuG+x9Wi5dMoT77SRHgRumxvip9l3PDS0taf6+b9lv4Tw5prK9hW5letbnLsMV1lQG9z69rOCa3a+qAn/Tt38CV8Kn4Me0lEhJ/mSmh+IgJQIHFmtHc2yMz7uluPYzsQL+Hg6XdWrs7nF8Zdwn6RHyixKt4zErwCUc5suNNc6ql9ZqnqB7jwpSaJTeCpRy03mlF6Jc7MJ/cfZAauv7B/CzsRT3kpX9Y+NZa1DeAWMP6WyMzxU3LgeNLctiDaqB/QZyrWoszJ5jjdlqVxzqNn7PP1FFJMuHlJ5eB25PnlCFWVlRURw/gbE9IFd6iuOTFQfF7RJuveDhkZUe7Q97YcRhTybpZ7q1LGj6/Jgd4T9wGHvxg+3qZHePn/LzEJtF3PZ6lM7nwmvpGd/2xU8rqvi5tJLUefwe9jP8dlntluDyZztvf+IFJtpq1oqn0wCFJmh5scsGukr6CfQPGbyFcIObDKfl1rg35U/FLm36OSo47F3dQGFijjOifTRlS1DFboXRrgSu1n6naO0KyBuZkMA+g66itJUhVQSnsuV4NnBYIR9Bd39USu8S3LwG1YBUVlr67ntnuzhxI7SBrgIxJwFjlK2UBpSi9VmS+rl0WnZWquPanV+tLivOW13OOi8vQ+kBAdwQfIbDVY0mG24IR1O2nJa3vOpS54u91NlEN26f4GQ4FzeCsZ+hP5+OqmwJrgSkQGroF0wSSrKCNq4ZXlbarxxx7LrBXCkrCKdFV9zHVhyUxresDH1x7BqFntl1E+28f+eIY6NWXFEXeGGGdymTWLQ3QAPCDclZKbwKPJcecri1y4qela08CutSQN588aRNy1AF+56D9gkf4g8eDStceg5bhjRaljanpWiJMu0moz+fFnNqq3iMy+yi74YCYtxoeIxUH7tJlBQ3HCMtn2PTYMWjvRd0enjNuyznjfCfkivnOG8BNp+L+BCwjM2wOm91r8HIl/Fo73tlfL2JVeoJ9zNlkYiW5wPOykf1YTnclqUqhVkwpNrpiSifEmPF99z46fViVq+XKQxGJETHU/BHH0YoPLT2vZ+U58f9O8doWIKsVN84rz10IbLCCyeESIiOV9OKss3BQG1ZRsKSqWA/GfWELdzOWCj/VkN3Mq9JHbIoDWMhldMeRiiS/6BhRbqEw4ko7a5H2BN5pGRXs5qcKnIsw5dPI+ZhrqjLmG0hjpkpBgy/zdakgbQtQQuFwcxH2d5X4tLMnx/jlylPgGl3K9OaJcVK47OTuoAVCuNRbOQjUDK9cAYcRYynv+n/A22KxhU+vZ1dAAAAAElFTkSuQmCC" alt="${brand}">
</div>
 <tab-slider id="navbar-slider" class="nav-item align-center"></tab-slider>
 
 <div class="toggle-wrapper nav-item align-right">
 <button class="theme-toggle-btn" id="themeBtn" aria-label="Toggle Theme">

<svg  id="sunIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-6">
  <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clip-rule="evenodd" />
</svg>

 <svg  id="moonIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  class="size-6">
  <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
</svg>

 
 </button>
 <span class="toggle-text" id="toggleText">View in Light Mode</span>
 </div>
 </nav>
 `;

 // Re-setup after render
 this.setupThemeToggle();
 
 // Re-apply tabs data if it exists
 if (this._tabsData.length > 0) {
 this.applyTabsToSlider();
 }
 }
setupThemeToggle() {
  const btn = this.shadowRoot.querySelector('#themeBtn');
  const sunIcon = this.shadowRoot.querySelector('#sunIcon');
  const moonIcon = this.shadowRoot.querySelector('#moonIcon');
  const text = this.shadowRoot.querySelector('#toggleText');

  if (!btn) return;

  const currentTheme = localStorage.getItem('theme') || 'dark';

  if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
    moonIcon.classList.add('active');
    sunIcon.classList.add('enter-top');
    text.textContent = 'View in Dark Mode';
  } else {
    sunIcon.classList.add('active');
    moonIcon.classList.add('enter-top');
    text.textContent = 'View in Light Mode';
  }

  btn.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light-theme');

  if (isLight) {
    // Clean up sunIcon (exiting)
    sunIcon.classList.remove('active', 'enter-top');
    sunIcon.classList.add('exit-down');
    
    // Clean up moonIcon (entering)
    moonIcon.classList.remove('enter-top', 'exit-down');
    
    // Force reflow for animation
    void moonIcon.offsetWidth;
    
    moonIcon.classList.add('active');
    text.textContent = 'View in Dark Mode';
    localStorage.setItem('theme', 'light');
  } else {
    // Clean up moonIcon (exiting)
    moonIcon.classList.remove('active', 'enter-top');
    moonIcon.classList.add('exit-down');
    
    // Clean up sunIcon (entering)
    sunIcon.classList.remove('enter-top', 'exit-down');
    
    // Force reflow for animation
    void sunIcon.offsetWidth;
    
    sunIcon.classList.add('active');
    text.textContent = 'View in Light Mode';
    localStorage.setItem('theme', 'dark');
  }
});
}

 applyTabsToSlider() {
 const slider = this.shadowRoot.querySelector('tab-slider');
 if (slider && this._tabsData.length > 0) {
 slider.tabs = this._tabsData;
 }
 }

 set menuItems(data) {
 this._tabsData = data;
 this.applyTabsToSlider();
 }

 get menuItems() {
 return this._tabsData;
 }
}

customElements.define('my-navbar', MyNavbar);
