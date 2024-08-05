export const dateConvert = (dateMilli) => {

    const valid = isDateString(dateMilli)
    // console.log("dateMilli", dateMilli, valid)


    // if (isDateString(dateMilli) ) {
        var d = (new Date(dateMilli) + '').split(' ');
        return [d[2], d[1]].join(' ');
    // }
    // else return dateMilli

    
}


export function isDateString(dateString) {
    const validFormat = /^\w{3} \w{3} \d{2} \d{4} \d{2}:\d{2}:\d{2} GMT[+-]\d{4} \(.+\)$/;

    if (validFormat.test(dateString)) {
      return true;
    } else {
      return false;
    }
  }

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
  const inputDateObjects = inputDates.map(dateStr => new Date(dateStr));

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