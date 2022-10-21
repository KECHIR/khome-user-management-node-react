export async function create(userData) {
    const addUserResponse = await fetch('/user/add', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    });
    const res = await addUserResponse.json();
    return res;
}

export const fetchUsersList = async () => {
    const res = await fetch('/user/all-users');
    const { data } = await res.json() || {};
    return data;
};

export const fetchUser = async (userId) => {
    const res = await fetch(`/user/${userId}`);
    return await res.json() || {};
};

export async function deleteUsers(users) {
    const addUserResponse = await fetch('/user/delete', {
        method: 'DELETE',
        body: JSON.stringify(users),
        headers: {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    });
    const res = await addUserResponse.json();
    return res;
}

export async function update (userData) {
    const addUserResponse = await fetch('/user/update', {
        method: 'PUT',
        body: JSON.stringify(userData),
        headers: {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    });
    const res = await addUserResponse.json();
    return res;
};