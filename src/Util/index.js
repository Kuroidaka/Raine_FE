import pako from 'pako';
import base64js from 'base64-js';
import { jwtDecode } from 'jwt-decode';

export const dateConvert = (dateMilli) => {
  return new Date(dateMilli).toLocaleString('en-GB', {
    weekday: 'short', // Fri
    day: '2-digit',   // 23
    month: 'short',   // Aug
    hour: 'numeric',  // 11
    minute: '2-digit', // 08
    hour12: true      // 12-hour clock
  });
}

export const dateConvertForModal = (dateMilli) => {

  const date = new Date(dateMilli);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
      console.error("Invalid date input");
      return dateMilli;  // Return the original input if it's not a valid date
  }

  const d = date.toUTCString().split(' ');
  return [d[1], d[2]].join(' ');
}


export function isDateString(dateString) {
  const validFormat = /^\w{3} \w{3} \d{2} \d{4} \d{2}:\d{2}:\d{2} GMT[+-]\d{4} \(.+\)$/;
  if (validFormat.test(dateString)) {
    return true;
  } else {
    return false;
  }
}

export const isISODateString = (dateString) => {
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  return isoDatePattern.test(dateString);
};

export function compareDates(date1, date2) {
  // Set time to zero for both dates
  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);

  if (date1 < date2) {
    return -1;
  } else if (date1 > date2) {
    return 1;
  } else {
    return 0;
  }
}

export const convertUpperCase = (string) => {
  const upperCase = string.toUpperCase()
  console.log(upperCase)
  return upperCase
}

export const convertDates = (dateArray) => {
    return dateArray.map(dateStr => {
        let date = new Date(dateStr);
        return date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
    });
}

export const convertDatesRoutine = (dateArray) => {
  return dateArray.map(dateStr => {
    let date = new Date(dateStr.completion_date);

    // Format the date to "Y-m-d H:i"
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero
    const hours = String(date.getHours()).padStart(2, '0'); // Add leading zero
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Add leading zero

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  });
}

export function formatTimeHHmm(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function convertTimeHHmmToDate(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();

  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0); // Optionally reset seconds to 0
  date.setMilliseconds(0); // Optionally reset milliseconds to 0

  return date;
}



export const  getRecentSevenDates = (array) => {
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var now = new Date(); 
  var dates = array.map(date => new Date(date))

  var orderedDates = weekDays.map((day,index) => {
    var dateInWeek = dates.find(date => date.getDay() === (now.getDay() + index + 1) % 7);
    return dateInWeek ? dateInWeek.toString() : null;
  });

  return orderedDates;
}


export const updateRecentDates = (inputDates) => {
  const recentDates = [];

  // Helper function to format date to the desired string format
  const formatDate = (date) => {
    return date.toDateString() + ' ' + date.toTimeString().split(' ')[0] + ' GMT+0700 (Indochina Time)';
  };

  // Helper function to compare dates ignoring the time part
  const isSameDate = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  // Create recentDates array with the last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    recentDates.push({ value: formatDate(date), check: false });
  }

  // Convert input dates to Date objects for easier comparison
  const inputDateObjects = inputDates.map(dateStr => new Date(dateStr.completion_date));

  // Check and update the 'check' key if dates match
  recentDates.forEach(recentDateObj => {
    let recentDate = new Date(recentDateObj.value);
    if (inputDateObjects.some(inputDate => isSameDate(inputDate, recentDate))) {
      recentDateObj.check = true;
    }
  });

  return recentDates;
}

export const downloadImageFromBase64 = (base64String) => {
    
  const date = new Date();
  const filename = `image-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}.png`;

  // Create a link element
  const link = document.createElement('a');
  
  // Set the link's href to the base64 string
  link.href = base64String;
  
  // Set the download attribute with the filename
  link.download = filename;
  
  // Append the link to the body (required for Firefox)
  document.body.appendChild(link);
  
  // Programmatically click the link to trigger the download
  link.click();
  
  // Remove the link from the document
  document.body.removeChild(link);
};
  
  // Example usage
//   const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...'; // Your base64 string here
//   const filename = 'downloaded-image.png';
//   downloadImageFromBase64(base64Image, filename);
  

export const base64ToBlob = (base64, mimeType) => {
  const byteCharacters = atob(base64.split(",")[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

export function filesToBlobURLs(files) {
  return files.map((file) => {
      return URL.createObjectURL(file);
  });
}

export const filesToBase64 = (files) => {
  return Promise.all(
    files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    })
  );
}


export const hostImages = async (base64Images) => {
  const urls = await Promise.all(base64Images.map(async (base64Image) => {
    const blob = base64ToBlob(base64Image, "image/jpeg");
    const formData = new FormData();
    formData.append("file", blob, "image.jpg");

    const response = await fetch("https://tmpfiles.org/api/v1/upload", {
      method: "POST",
      body: formData,
    });

    const { data } = await response.json();

    return data.url.replace("https://tmpfiles.org/", "https://tmpfiles.org/dl/");
  }));

  return urls;
}

export const checkIsImgLink = (input) => {
    if(input === "" || input === undefined || input === null) return false;
    const urlRegex = /(http[s]?:\/\/){0,1}(\w+:\w+@){0,1}([a-zA-Z0-9.-]+)(:[0-9]+){0,1}(\/[a-zA-Z0-9.-]+)*\/?/;
    const url = input.match(urlRegex);

    const imageRegex = /\.(jpeg|jpg|gif|png)$/;
    if(url.length > 0 ) {
        const isImage = imageRegex.test(url[0]);
        return isImage;
    }
}

export function isObject(value) {
  return value && typeof value === 'object' && value.constructor === Object;
}

export const compressBase64Data = (base64Data) => {
  // Ensure Base64 string length is a multiple of 4 by padding with '='
  const paddedBase64Data = base64Data.padEnd(Math.ceil(base64Data.length / 4) * 4, '=');

  // Decode Base64 data to binary
  const binaryData = base64js.toByteArray(paddedBase64Data);

  // Compress binary data using pako
  const compressedData = pako.gzip(binaryData);

  // Encode compressed data back to Base64
  const compressedBase64Data = base64js.fromByteArray(compressedData);

  return compressedBase64Data;
};


/**
 * Converts a base64 string into a File object with a date string as the file name
 * and uses a smaller image type (JPEG) by default.
 * @param {string} base64String - The base64 encoded string
 * @returns {File} - The resulting File object
 */
export function base64ToFile(base64String) {
  // Decode base64 string
  const byteString = atob(base64String.split(',')[1]);

  // Convert to byte array
  const byteNumbers = new Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
      byteNumbers[i] = byteString.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  // Create the file name using the current date string
  const fileName = `${new Date().toISOString().replace(/[:.-]/g, '')}.jpeg`;

  // Create the File object, defaulting to JPEG for smaller file size
  return new File([byteArray], fileName, { type: 'image/jpeg' });
}

// Example usage:
// const file = base64ToFile(base64String);


export const decodeToken = (token) => {
  try {
      // Decode the token
      const decoded = jwtDecode(token);
      return decoded;
  } catch (error) {
      console.error('Invalid token:', error);
      return null;
  }
};

export function convertToTodayWithSameTime(dateString) {
  // Parse the input date string
  const inputDate = new Date(dateString);

  // Get today's date
  const today = new Date();

  // Create a new Date object with today's date and the same time as the input date
  const result = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    inputDate.getHours(),
    inputDate.getMinutes(),
    inputDate.getSeconds(),
    inputDate.getMilliseconds()
  );

  return result;
}


/**
 * Utility function to fetch a .webm file from a Blob URL, return it as a File object,
 * and trigger a download.
 *
 * @param {string} blobUrl - The Blob URL that you want to convert into a .webm file.
 * @param {string} fileName - The name of the file to be returned and downloaded (default is 'video.webm').
 * @returns {Promise<File>} - A promise that resolves to the .webm File object.
 */
export function getWebmFileFromBlobUrl(blobUrl, fileName = new Date().getTime() + '.webm') {
  return fetch(blobUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch Blob from URL: ${response.statusText}`);
      }
      return response.blob();
    })
    .then(blob => {
      const file = new File([blob], fileName, { type: 'video/webm' });
      return file;
    })
    .catch(error => {
      console.error('Error fetching Blob:', error);
      throw error;
    });
}
