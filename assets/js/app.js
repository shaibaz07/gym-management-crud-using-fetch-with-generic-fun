const cl = console.log;


const memberForm = document.getElementById('memberForm')
const memberLists = document.getElementById('memberLists')
const addMemberdBtn = document.getElementById('addMemberdBtn')

const fullName = document.getElementById('fullName')
const date = document.getElementById('date')

const trainer = document.getElementById('trainer')
const memberShipType = document.getElementById('memberShipType')
const contact = document.getElementById('contact')
const updateMemberBtn = document.getElementById('updateMemberBtn')
const spinner = document.getElementById('spinner')

const BaseUrl = `https://studentpost-5eee3-default-rtdb.asia-southeast1.firebasedatabase.app`
const MemberUrl = `${BaseUrl}/stdWithGeneric.json`


const state = {
    membersArr: [],
    editId: null
}


function ObjtoArr(obj) {
    for (const key in obj) {

        obj[key].id = key;
        state.membersArr.unshift(obj[key])
    }
}

function snackBar(msg, icon) {
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 2500,
        confirmButtonColor: "#000602bf"
    })
}

function makeApiCall(Url, methodName, bodyMsg) {
    bodyMsg = bodyMsg ? JSON.stringify(bodyMsg) : null
    return fetch(Url, {
        method: methodName,
        body: bodyMsg,
        headers: {
            "Content-Type": "application/Json",
            "Auth": "JWT Token"
        }
    })

        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP ERROR : ${res.status}`)
            }
            return res.json()
        })
}

function showSpinner() {
    spinner.classList.remove('d-none')
}
function hideSpinner() {
    spinner.classList.add('d-none')

}

function readMembers(arr) {
    let result = ``
    arr.forEach((members, i) => {
        result += `
                <tr id="${members.id}">
                                    <td>${1 + i}</td>
                                    <td>${members.fullName}</td>
                                    <td>${members.contact}</td>
                                    <td>${members.memberShipType}</td>
                                    <td>${members.trainer}</td>
                                    <td>${members.date}</td>
                                    
                                    <td class="text-center">
                                        <i onClick ="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"></i>
                                    </td>
                                    <td class="text-center">
                                        <i onClick ="onRemove(this)" class="fa-solid fa-trash-can fa-2x text-danger"></i>
                                    </td>

                                </tr>
            
            `

    });
    memberLists.innerHTML = result

}


function fetchMembers() {
    showSpinner()
    makeApiCall(MemberUrl, "GET")
        .then(res => {
            ObjtoArr(res)
            readMembers(state.membersArr)
        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            hideSpinner()
        })
}

fetchMembers()


function membersAdd(eve) {
    eve.preventDefault()

    let newMember = {
        fullName: fullName.value,
        contact: contact.value,
        memberShipType: memberShipType.value,
        trainer: trainer.value,
        date: date.value,
        id: Date.now()
    }

    showSpinner()
    makeApiCall(MemberUrl, "POST", newMember)
        .then(res => {
            state.membersArr.unshift(newMember);
            newMember.id = res.name
            let tr = document.createElement('tr');
            tr.id = res.name;

            tr.innerHTML = `        <td>${state.membersArr.length}</td>
                                    <td>${newMember.fullName}</td>
                                    <td>${newMember.contact}</td>
                                    <td>${newMember.memberShipType}</td>
                                    <td>${newMember.trainer}</td>
                                    <td>${newMember.date}</td>
                                    
                                    <td class="text-center">
                                        <i onClick ="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"></i>
                                    </td>
                                    <td class="text-center">
                                        <i onClick ="onRemove(this)" class="fa-solid fa-trash-can fa-2x text-danger"></i>
                                    </td>`


            memberForm.reset()
            memberLists.prepend(tr);
            snackBar(`New Member With id:${tr.id} added successfully !!!`, "success")

        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            hideSpinner()
        })

}

function onEdit(ele) {
    let Edit_Id = ele.closest('tr').id;
    state.editId = Edit_Id
    let Edit_Obj = state.membersArr.find(m => m.id === Edit_Id)

    fullName.value = Edit_Obj.fullName;
    contact.value = Edit_Obj.contact;
    memberShipType.value = Edit_Obj.memberShipType;
    trainer.value = Edit_Obj.trainer;
    date.value = Edit_Obj.date;

    addMemberdBtn.classList.add('d-none')
    updateMemberBtn.classList.remove('d-none')


}

function onUpdateMembership() {
    let Update_Id = state.editId;
    let Update_Url = `${BaseUrl}/stdWithGeneric/${Update_Id}.json`

    let Updated_Obj = {
        fullName: fullName.value,
        contact: contact.value,
        memberShipType: memberShipType.value,
        trainer: trainer.value,
        date: date.value,
        id: Update_Id
    }

    showSpinner()
    makeApiCall(Update_Url, "PATCH", Updated_Obj)
        .then(res => {
            let Update_Idx = state.membersArr.findIndex(m => m.id === Update_Id)
            state.membersArr[Update_Idx] = Updated_Obj;

            let tr = document.getElementById(Update_Id)
            tr.innerHTML = `
                             <td>${state.membersArr.length}</td>
                                    <td>${Updated_Obj.fullName}</td>
                                    <td>${Updated_Obj.contact}</td>
                                    <td>${Updated_Obj.memberShipType}</td>
                                    <td>${Updated_Obj.trainer}</td>
                                    <td>${Updated_Obj.date}</td>
                                    
                                    <td class="text-center">
                                        <i onClick ="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"></i>
                                    </td>
                                    <td class="text-center">
                                        <i onClick ="onRemove(this)" class="fa-solid fa-trash-can fa-2x text-danger"></i>
                                    </td>
            
                       `
            memberForm.reset()
            updateMemberBtn.classList.add('d-none')
            addMemberdBtn.classList.remove('d-none')

            snackBar(`Updated Membership With id:${Update_Id} updated successfully !!!`, "success")


        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            hideSpinner()
        })

}




function onRemove(ele) {
    let Remove_Id = ele.closest('tr').id

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#000602bf",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        showSpinner()
        let Remove_Url = `${BaseUrl}/stdWithGeneric/${Remove_Id}.json`

        if (result.isConfirmed) {
            makeApiCall(Remove_Url, "DELETE",)
                .then(res => {
                    let Remove_Idx = state.membersArr.findIndex(m => m.id === Remove_Id)
                    state.membersArr.splice(Remove_Idx, 1)
                    ele.closest('tr').remove()

                    snackBar(` Member With id:${Remove_Id} removed successfully !!!`, "success")

                })
                .catch(err => {
                    cl(err)
                })
                .finally(() => {
                    hideSpinner()
                })
        }
    });


}


updateMemberBtn.addEventListener("click", onUpdateMembership)
memberForm.addEventListener("submit", membersAdd)