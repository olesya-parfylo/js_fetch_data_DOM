'use strict';

const baseUrl = `https://mate-academy.github.io/`
  + `phone-catalogue-static/api/phones`;

const list = `${baseUrl}.json`;

function request(url) {
  return fetch(url)
    .then(responce => responce.json());
}

function getPhones(url) {
  const resolver = (resolved, rejected) => {
    request(url)
      .then(phones => {
        resolved(phones);
      });

    setTimeout(() => {
      rejected();
    }, 5000);
  };

  return new Promise(resolver);
}

function getPhonesDetails(listPhones) {
  return listPhones.map(phone => request(`${baseUrl}/${phone.id}.json`));
}

const phonesDetails = getPhones(list)
  .then(phonesIdsRequest => Promise.all(getPhonesDetails(phonesIdsRequest)));

phonesDetails
  .then(phonesArray => showPhoneNames(phonesArray));

function showPhoneNames(arrPhones) {
  document.body.style['flex-direction'] = 'column';
  document.body.style.alignItems = 'flex-start';
  document.body.style.marginLeft = '50%';
  document.body.style.transform = 'translateX(-25%)';

  arrPhones.map(phone => {
    const cell = document.createElement('div');

    cell.innerText = phone.id;
    cell.style.marginTop = '10px';
    cell.style.fontSize = '20px';
    document.body.append(cell);
  });
}

function getPhoneById(arrPromise, id) {
  return arrPromise
    .then(arr => arr.find(item => item.id === id));
}

getPhones(list)
  .then(phonesList => {
    const phonesWithDetails = phonesList.map((phone) => {
      phone.id = getPhoneById(phonesDetails, phone.id);

      return phone;
    });

    return phonesWithDetails;
  });
