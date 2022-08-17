(() => {
    // Get data from localStorage
    const appData = localStorage.getItem('reduxPersist:__app__')
    if (!appData) return;

    // If the user is logged in, get the ids of accounts
    const json = JSON.parse(appData);
    const accounts = Object.keys(json.accounts);

    const account = accounts[0];
    console.log('Account id:', account);

    // Get token and username using the first account's id as the key
    const token = json.accounts[account].accessToken;
    const username = json.accounts[account].username;

    const regex = new RegExp(`https://tellonym.me/${username}`, 'g');

    // Replace the tellonym.me url with the token
    const html = document.body.innerHTML;
    document.body.innerHTML = html.replace(regex, token);;

    // Logging results
    console.log(`Got token for "${username}":`, token);
    return alert(`Got token for "${username}", you should find it instead of your link`);
})();