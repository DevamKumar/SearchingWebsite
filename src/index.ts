const getUsername = document.querySelector("#user") as HTMLInputElement;
const formSubmit = document.querySelector("#form") as HTMLFormElement;
const main_container = document.querySelector(".main_container") as HTMLElement;
// user contracts to fetch from api
interface UserData {
  id: number;
  login: string;
  avatar_url: string;
  location: string;
  url: string;
}
// reuseable function
async function myCustomFetcher<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Network was not ok - status ${response.status}`);
  }

  const data = await response.json();
  //   console.log(data);
  return data;
}
// lets display card ui
const showResultUI = (singleUser: UserData) => {
  const { login, avatar_url, location, url } = singleUser;
  main_container.insertAdjacentHTML(
    "beforeend",
    `<div class = 'card'> 
    <img src=${avatar_url} alt=${login}/> 
    <hr/> 
    <div class = "card-footer"> 
    <img src ="${avatar_url}" alt="${login}"/> 
    <a href = "${url}">GitHUb </a> 
    </div> 
    </div>`
  );
};

// creating a defualt function that will show the users whenever the page is loaded
function fetchUserData(url: string) {
  myCustomFetcher<UserData[]>(url, {}).then((userInfo) => {
    for (const singleUser of userInfo) {
      showResultUI(singleUser);
    }
  });
}

// default fun call
fetchUserData("https://api.github.com/users");

// lets perform search functionality
formSubmit.addEventListener("submit", async (e) => {
  e.preventDefault();
  const searchTerm = getUsername.value.toLowerCase();
  try {
    const url = "https://api.github.com/users";
    const allUserData = await myCustomFetcher<UserData[]>(url, {});
    const matchingUsers = allUserData.filter((user) => {
      return user.login.toLowerCase().includes(searchTerm);
    });

    // to clear previous data

    main_container.innerHTML = "";

    if (matchingUsers.length === 0) {
      main_container.insertAdjacentHTML(
        "beforeend",
        `<p class = "empty-msg"> No Users found</p>`
      );
    } else {
      for (const singleUser of matchingUsers) {
        showResultUI(singleUser);
      }
    }
  } catch (error) {
    console.log(error);
  }
});
