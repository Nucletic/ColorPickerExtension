const questionMark = document.querySelectorAll('div[data-key]');
const helpQuest = document.querySelectorAll('span[data-key]');

const howWorks = (key) => {
  questionMark[key - 1].style.display = 'block';
};
const howWorksOff = (key) => {
  questionMark[key - 1].style.display = 'none';
};

helpQuest.forEach(button => {
  button.addEventListener('mouseover', (e) => { howWorks(button.dataset.key) });
  button.addEventListener('mouseout', (e) => { howWorksOff(button.dataset.key) });
});

let pickedColors = JSON.parse(localStorage.getItem('colors') || "[]");
const colorList = document.querySelector('.recentColorsMain');

const clearBtn = document.querySelector('.recentColorsTitle span');

clearBtn.addEventListener('click', () => {
  pickedColors = []
  localStorage.removeItem("colors");
  colorList.innerHTML = '';
})

const copyHoverFunc = () => {
  const recentColorMain = document.querySelectorAll('.recentColor');
  const recentColor = document.querySelectorAll('.recentColor div');
  const colorToCopy = document.querySelectorAll('.recentColor p');
  const copyColor = (key, action) => {
    if (action === 'hover') {
      recentColor[key - 1].style.opacity = '1';
      recentColor[key - 1].style.transform = 'scale(1)';
    }
    if (action === 'click') {
      recentColor[key - 1].innerHTML = 'Copied!';
      navigator.clipboard.writeText(colorToCopy[key - 1].innerHTML);
    }
    if (action === 'hoverOut') {
      recentColor[key - 1].style.transform = 'scale(0.9)';
      recentColor[key - 1].style.opacity = '0';
      recentColor[key - 1].innerHTML = 'Copy';
    }
  }

  recentColor.forEach(color => {
    color.addEventListener('click', (e) => { copyColor(color.dataset.key, 'click') })
    color.addEventListener('mouseout', (e) => { copyColor(color.dataset.key, 'hoverOut') })
  })
  recentColorMain.forEach(color => {
    color.addEventListener('mouseover', (e) => { copyColor(color.dataset.key, 'hover') })
  })
}

var mainDiv, span, para, copyDiv;

const showColors = () => {
  colorList.innerHTML = '';
  for (let i = 0; i < pickedColors.length; i++) {
    mainDiv = document.createElement('div')
    mainDiv.setAttribute('data-key', `${i + 1}`);
    mainDiv.classList.add('recentColor')

    span = document.createElement('span')
    span.style.background = `${pickedColors[i]}`
    mainDiv.appendChild(span)

    para = document.createElement('p')
    para.setAttribute('data-key', `${i + 1}`)
    para.innerHTML = pickedColors[i]
    mainDiv.appendChild(para)

    copyDiv = document.createElement('div')
    copyDiv.setAttribute('data-key', `${i + 1}`)
    copyDiv.innerHTML = 'Copy'
    mainDiv.appendChild(copyDiv)
    colorList.appendChild(mainDiv)
  }
  copyHoverFunc()
}
showColors()

const pickColorBtn = document.getElementById('pickColorBtn');
const pickColorBtnSvg = document.querySelector('#pickColorBtn svg');
const pickColorBtnP = document.querySelector('#pickColorBtn p');
const pickColorBtnPSpan = document.querySelector('#pickColorBtn p span');

const averageBtn = document.getElementById('averageBtn');
const averageBtnSvg = document.querySelector('#averageBtn svg');
const averageBtnP = document.querySelector('#averageBtn p');
const averageBtnPSpan = document.querySelector('#averageBtn p span');

const customBtn = document.getElementById('customBtn');
const customBtnSvg = document.querySelector('#customBtn svg');
const customBtnP = document.querySelector('#customBtn p');
const customBtnPSpan = document.querySelector('#customBtn p span');

const pickColor = async () => {
  try {
    pickColorBtn.style.background = '#fff'
    pickColorBtnSvg.style.fill = '#000'
    pickColorBtnP.style.color = '#000'
    pickColorBtnPSpan.style.color = '#000'
    pickColorBtnPSpan.style.border = '1px solid #000'

    if ('EyeDropper' in window) {
      const eyeDropper = new EyeDropper();
      const { sRGBHex } = await eyeDropper.open();
      if (sRGBHex) {
        pickColorBtn.style.background = 'rgba(17, 25, 40, 0.44)'
        pickColorBtnSvg.style.fill = '#fff'
        pickColorBtnP.style.color = '#fff'
        pickColorBtnPSpan.style.color = '#fff'
        pickColorBtnPSpan.style.border = '1px solid #fff'
      }

      navigator.clipboard.writeText(sRGBHex);
      pickedColors.push(sRGBHex)
      localStorage.setItem('colors', JSON.stringify(pickedColors));
      showColors()
    }
  } catch (error) {
    console.log(error);
  }
};
const buildPalette = (colorsList) => {
  const orderedByColor = orderByLuminance(colorsList);
  const hslColors = convertRGBtoHSL(orderedByColor);
  const storageColors = [];
  elemNo = 1
  colorList.innerHTML = ''
  for (let i = 0; i < orderedByColor.length; i++) {
    const hexColor = rgbToHex(orderedByColor[i]);
    const hexColorComplementary = hslToHex(hslColors[i]);
    if (i > 0) {
      const difference = calculateColorDifference(
        orderedByColor[i],
        orderedByColor[i - 1]
      );
      if (difference < 120) {
        continue;
      }
    }
    mainDiv = document.createElement('div')
    mainDiv.setAttribute('data-key', `${elemNo}`);
    mainDiv.classList.add('recentColor')

    span = document.createElement('span')
    span.style.background = `${hexColor}`
    mainDiv.appendChild(span)

    para = document.createElement('p')
    para.setAttribute('data-key', `${elemNo}`)
    para.innerHTML = hexColor
    mainDiv.appendChild(para)

    copyDiv = document.createElement('div')
    copyDiv.setAttribute('data-key', `${elemNo}`)
    copyDiv.innerHTML = 'Copy'
    mainDiv.appendChild(copyDiv)
    colorList.appendChild(mainDiv)
    storageColors.push(hexColor)
    elemNo += 1
  }
  localStorage.setItem('colors', JSON.stringify(storageColors));
  copyHoverFunc()
};
const findBiggestColorRange = (rgbValues) => {
  let rMin = Number.MAX_VALUE;
  let gMin = Number.MAX_VALUE;
  let bMin = Number.MAX_VALUE;
  let rMax = Number.MIN_VALUE;
  let gMax = Number.MIN_VALUE;
  let bMax = Number.MIN_VALUE;
  rgbValues.forEach((pixel) => {
    rMin = Math.min(rMin, pixel.r);
    gMin = Math.min(gMin, pixel.g);
    bMin = Math.min(bMin, pixel.b);
    rMax = Math.max(rMax, pixel.r);
    gMax = Math.max(gMax, pixel.g);
    bMax = Math.max(bMax, pixel.b);
  });
  const rRange = rMax - rMin;
  const gRange = gMax - gMin;
  const bRange = bMax - bMin;
  const biggestRange = Math.max(rRange, gRange, bRange);
  if (biggestRange === rRange) {
    return "r";
  } else if (biggestRange === gRange) {
    return "g";
  } else {
    return "b";
  }
};
const calculateColorDifference = (color1, color2) => {
  const rDifference = Math.pow(color2.r - color1.r, 2);
  const gDifference = Math.pow(color2.g - color1.g, 2);
  const bDifference = Math.pow(color2.b - color1.b, 2);
  return rDifference + gDifference + bDifference;
};
const rgbToHex = (pixel) => {
  const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };

  return (
    "#" +
    componentToHex(pixel.r) +
    componentToHex(pixel.g) +
    componentToHex(pixel.b)
  ).toUpperCase();
};
const buildRgb = (imageData) => {
  const rgbValues = [];
  for (let i = 0; i < imageData.length; i += 4) {
    const rgb = {
      r: imageData[i],
      g: imageData[i + 1],
      b: imageData[i + 2],
    };
    rgbValues.push(rgb);
  }

  return rgbValues;
};
const quantization = (rgbValues, depth) => {
  const MAX_DEPTH = 4;
  if (depth === MAX_DEPTH || rgbValues.length === 0) {
    const color = rgbValues.reduce(
      (prev, curr) => {
        prev.r += curr.r;
        prev.g += curr.g;
        prev.b += curr.b;
        return prev;
      },
      {
        r: 0,
        g: 0,
        b: 0,
      }
    );
    color.r = Math.round(color.r / rgbValues.length);
    color.g = Math.round(color.g / rgbValues.length);
    color.b = Math.round(color.b / rgbValues.length);
    return [color];
  }
  const componentToSortBy = findBiggestColorRange(rgbValues);
  rgbValues.sort((p1, p2) => {
    return p1[componentToSortBy] - p2[componentToSortBy];
  });

  const mid = rgbValues.length / 2;
  return [
    ...quantization(rgbValues.slice(0, mid), depth + 1),
    ...quantization(rgbValues.slice(mid + 1), depth + 1),
  ];
};
const orderByLuminance = (rgbValues) => {
  const calculateLuminance = (p) => {
    return 0.2126 * p.r + 0.7152 * p.g + 0.0722 * p.b;
  };
  return rgbValues.sort((p1, p2) => {
    return calculateLuminance(p2) - calculateLuminance(p1);
  });
};
const convertRGBtoHSL = (rgbValues) => {
  return rgbValues.map((pixel) => {
    let hue,
      saturation,
      luminance = 0;
    let redOpposite = pixel.r / 255;
    let greenOpposite = pixel.g / 255;
    let blueOpposite = pixel.b / 255;
    const Cmax = Math.max(redOpposite, greenOpposite, blueOpposite);
    const Cmin = Math.min(redOpposite, greenOpposite, blueOpposite);
    const difference = Cmax - Cmin;
    luminance = (Cmax + Cmin) / 2.0;
    if (luminance <= 0.5) {
      saturation = difference / (Cmax + Cmin);
    } else if (luminance >= 0.5) {
      saturation = difference / (2.0 - Cmax - Cmin);
    }
    const maxColorValue = Math.max(pixel.r, pixel.g, pixel.b);
    if (maxColorValue === pixel.r) {
      hue = (greenOpposite - blueOpposite) / difference;
    } else if (maxColorValue === pixel.g) {
      hue = 2.0 + (blueOpposite - redOpposite) / difference;
    } else {
      hue = 4.0 + (greenOpposite - blueOpposite) / difference;
    }
    hue = hue * 60;
    if (hue < 0) {
      hue = hue + 360;
    }
    if (difference === 0) {
      return false;
    }
    return {
      h: Math.round(hue) + 180,
      s: parseFloat(saturation * 100).toFixed(2),
      l: parseFloat(luminance * 100).toFixed(2),
    };
  });
};
const hslToHex = (hslColor) => {
  const hslColorCopy = { ...hslColor };
  hslColorCopy.l /= 100;
  const a =
    (hslColorCopy.s * Math.min(hslColorCopy.l, 1 - hslColorCopy.l)) / 100;
  const f = (n) => {
    const k = (n + hslColorCopy.h / 30) % 12;
    const color = hslColorCopy.l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
};

const takeSnip = async (action, forCrop = '') => {
  try {
    if (action === 'fullWindow') {
      averageBtn.style.background = '#fff'
      averageBtnSvg.style.fill = '#000'
      averageBtnP.style.color = '#000'
      averageBtnPSpan.style.color = '#000'
      averageBtnPSpan.style.border = '1px solid #000'
    }
    if (action === 'cropWindow') {
      customBtn.style.background = '#fff'
      customBtnSvg.style.fill = '#000!important'
      customBtnP.style.color = '#000'
      customBtnPSpan.style.color = '#000'
      customBtnPSpan.style.border = '1px solid #000'
    }
    const stream = await navigator.mediaDevices.getDisplayMedia({ preferCurrentTab: true });
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.margin = 'auto';
    const CTX = canvas.getContext('2d');
    var imageData;
    video.addEventListener('loadedmetadata', () => {
      if (action === 'cropWindow') {
        canvas.width = forCrop[2];
        canvas.height = forCrop[3];
        video.play()
        CTX.drawImage(video, forCrop[0], forCrop[1], canvas.width, canvas.height);
      } else {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.play()
        CTX.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      stream.getVideoTracks()[0].stop();
      document.body.appendChild(canvas)
      imageData = CTX.getImageData(0, 0, canvas.width, canvas.height);
      if (action === 'fullWindow') {
        averageBtn.style.background = 'rgba(17, 25, 40, 0.44)'
        averageBtnSvg.style.fill = '#fff'
        averageBtnP.style.color = '#fff'
        averageBtnPSpan.style.color = '#fff'
        averageBtnPSpan.style.border = '1px solid #fff'
        getAverage(imageData)
      } else {
        customBtn.style.background = 'rgba(17, 25, 40, 0.44)'
        customBtnSvg.style.fill = '#fff'
        customBtnP.style.color = '#fff'
        customBtnPSpan.style.color = '#fff'
        customBtnPSpan.style.border = '1px solid #fff'
        getAverage(imageData)
      }
    })
    video.srcObject = stream;
    canvas.style.opacity = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.display = 'none';
  } catch (error) {
    console.log(error);
  }
}

const getAverage = (imageData) => {
  const rgbArray = buildRgb(imageData.data);
  const quantColors = quantization(rgbArray, 0);
  buildPalette(quantColors);
}



const makeResizableDiv = (div) => {
  const element = document.querySelector(div);
  element.style.display = 'block';

  const resizers = document.querySelectorAll(div + ' .resizer')
  const minimumSize = 20;
  let originalWidth = 0;
  let originalHeight = 0;
  let originalX = 0;
  let originalY = 0;
  let originalMouseX = 0;
  let originalMouseY = 0;
  let WHXY = [];
  for (let i = 0; i < resizers.length; i++) {
    const currentResizer = resizers[i];
    currentResizer.addEventListener('mousedown', (e) => {
      e.preventDefault()
      originalWidth = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
      originalHeight = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
      originalX = element.getBoundingClientRect().left;
      originalY = element.getBoundingClientRect().top;
      originalMouseX = e.pageX;
      originalMouseY = e.pageY;
      window.addEventListener('mousemove', resize)
      window.addEventListener('mouseup', stopResize)
      window.addEventListener('keydown', selectImage)

    })
    const resize = (e) => {
      if (currentResizer.classList.contains('bottom-right')) {
        const width = originalWidth + (e.pageX - originalMouseX);
        const height = originalHeight + (e.pageY - originalMouseY);
        if (width > minimumSize) {
          element.style.width = width + 'px'
        }
        if (height > minimumSize) {
          element.style.height = height + 'px'
        }
        WHXY = [];
        WHXY.push(originalX, originalY, width, height)
      }
      else if (currentResizer.classList.contains('bottom-left')) {
        const height = originalHeight + (e.pageY - originalMouseY)
        const width = originalWidth - (e.pageX - originalMouseX)
        if (height > minimumSize) {
          element.style.height = height + 'px'
        }
        if (width > minimumSize) {
          element.style.width = width + 'px'
          element.style.left = originalX + (e.pageX - originalMouseX) + 'px'
        }
        WHXY = [];
        WHXY.push(originalX, originalY, width, height)
      }
      else if (currentResizer.classList.contains('top-right')) {
        const width = originalWidth + (e.pageX - originalMouseX)
        const height = originalHeight - (e.pageY - originalMouseY)
        if (width > minimumSize) {
          element.style.width = width + 'px'
        }
        if (height > minimumSize) {
          element.style.height = height + 'px'
          element.style.top = originalY + (e.pageY - originalMouseY) + 'px'
        }
        WHXY = [];
        WHXY.push(originalX, originalY, width, height)
      }
      else {
        const width = originalWidth - (e.pageX - originalMouseX)
        const height = originalHeight - (e.pageY - originalMouseY)
        if (width > minimumSize) {
          element.style.width = width + 'px'
          element.style.left = originalX + (e.pageX - originalMouseX) + 'px'
        }
        if (height > minimumSize) {
          element.style.height = height + 'px'
          element.style.top = originalY + (e.pageY - originalMouseY) + 'px'
        }
        WHXY = [];
        WHXY.push(originalX, originalY, width, height)
      }
    }
    const selectImage = (e) => {
      if (e.key === 'Shift') {
        window.removeEventListener('mousemove', resize)
        window.removeEventListener('mouseup', stopResize)
        window.removeEventListener('keydown', selectImage)
        element.style.display = 'none';
        console.log('stoppedRezie')
        takeSnip('cropWindow', WHXY)

      }
    }
    const stopResize = () => {
      window.removeEventListener('mousemove', resize)
    }
  }
}



const resizeImage = (WHXY, canvas, CTX) => {
  console.log(canvas.width, canvas.height);
  imageData = CTX.getImageData(WHXY[0], WHXY[1], WHXY[2], WHXY[3])
  console.log(imageData);
}


pickColorBtn.addEventListener('click', pickColor)
averageBtn.addEventListener('click', (e) => { takeSnip('fullWindow') })
customBtn.addEventListener('click', (e) => { makeResizableDiv('.resizable') })



