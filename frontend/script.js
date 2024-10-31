const inputSurname = document.querySelector(".modal__surname")
const inputName = document.querySelector(".modal__name")
const inputLastname = document.querySelector(".modal__lastname")
const modalList = document.querySelector(".modal__list")
const modal = document.querySelector(".modal")
const modalWrap = document.querySelector(".modal-wrap")
const modalListWrap = document.querySelector(".modal__list-wrap")
const tableTbody = document.querySelector(".table__tbody")
const modalDisableDiv = Object.assign(document.createElement("div"), { className: "modal-disable" })
let trLoading = document.querySelector(".tr-loading")
let usersList = []
let userEditBtn

let timer
document.querySelector(".header__search").addEventListener("input", function (e) {
  clearTimeout(timer)
  timer = setTimeout(function () {
    clearTableBody()
    showLoadingUsers()
    getUsersByFilter(e.target.value)
  }, 300)
})

modalWrap.addEventListener("click", function (e) {
  if (e.currentTarget != e.target) return
  new Promise((resolve) => {
    hideModal()
    setTimeout(() => resolve(), 300)
  }).then(() => resetModal())
})

document.querySelector(".add-user-btn").addEventListener("click", function () {
  displayModal()
  modalListWrap.classList.remove("modal__list-wrap_fill")
})

document.querySelector(".modal__close-btn").addEventListener("click", function (e) {
  new Promise((resolve) => {
    hideModal()
    setTimeout(() => resolve(), 300)
  }).then(() => resetModal())
})

document.querySelector(".modal__cancel-btn").addEventListener("click", function (e) {
  if (e.target.textContent == "Удалить клиента") {
    modal.append(modalDisableDiv)
    deleteUser(modal.dataset.state.slice(3))
  } else {
    new Promise((resolve) => {
      hideModal()
      setTimeout(() => resolve(), 300)
    }).then(() => resetModal())
  }
})

document.querySelector(".modal__addContact-btn").addEventListener("click", function (e) {
  modalListWrap.classList.add("modal__list-wrap_fill")
  modalList.append(addContactItem())
  if (modalList.children.length == 10) {
    document.querySelector(".modal__addContact-btn").style.display = "none"
  }
})

document.querySelectorAll(".modal__field > input").forEach(input => {
  input.addEventListener("focus", function (e) {
    input.nextElementSibling.style.fontSize = "10px"
    input.nextElementSibling.style.top = "-10px"
  })
  input.addEventListener("blur", function (e) {
    if (input.value != "") return
    input.nextElementSibling.style.fontSize = "14px"
    input.nextElementSibling.style.top = "0px"
  })
})

document.querySelectorAll(".table__th-span").forEach(item =>
  item.addEventListener("click", function (e) {
    sortTable(e.currentTarget)
  })
)

let sortIndex = 1
let prevSortBtn = document.querySelector(".table__th-span")

function sortTable(param) {
  if (param.innerHTML === "Контакты" || param.innerHTML === "Действия") return
  param.style.color = "#9873FF"
  if (prevSortBtn == param) {
    if (sortIndex < 0) {
      param.querySelector(".table__th-arrow").innerHTML = "↑"
    } else {
      param.querySelector(".table__th-arrow").innerHTML = "↓"
    }
    sortIndex = -sortIndex
  } else {
    prevSortBtn.querySelector(".table__th-arrow").innerHTML = "↓"
    prevSortBtn.style.color = "var(--text-color-1)"
    param.querySelector(".table__th-arrow").innerHTML = "↑"
    prevSortBtn = param
    sortIndex = 1
  }

  switch (param.dataset.sort) {
    case "id":
      usersList.sort((a, b) => sortIndex * (a.id - b.id))
      break
    case "fio":
      usersList.sort((a, b) => {
        let nameA = `${a.surname} ${a.name} ${a.lastName}`
        let nameB = `${b.surname} ${b.name} ${b.lastName}`
        if (nameA > nameB) return sortIndex * 1
        if (nameA < nameB) return sortIndex * -1
        return 0
      })
      break
    case "crt":
      usersList.sort((a, b) => sortIndex * (new Date(a.createdAt) - new Date(b.createdAt)))
      break
    case "upd":
      usersList.sort((a, b) => sortIndex * (new Date(a.updatedAt) - new Date(b.updatedAt)))
      break
    default:
      break
  }
  displayListUsers(usersList)
}

function displayModal() {
  modalWrap.style.display = "flex"
  setTimeout(() => modalWrap.style.opacity = '1', 10)
}

function hideModal() {
  modalWrap.style.opacity = "0"
  setTimeout(() => modalWrap.style.display = "none", 300)
}

function resetModal() {
  modal.dataset.state = "new"
  modalDisableDiv.remove()
  modal.querySelector(".modal__title").style.textAlign = "left"
  let pDelete = modal.querySelector(".modal__delete-text")
  if (pDelete != undefined) pDelete.remove()
  modal.querySelector(".modal__title").innerHTML = "Новый клиент"
  modal.querySelector(".modal__cancel-btn").innerHTML = "Отмена"
  modal.querySelectorAll(".modal__field").forEach(item => item.style.display = "flex")
  modalListWrap.style.display = "block"
  modal.querySelectorAll(".modal__label").forEach(item => item.style.cssText = 'font-size: 14px; top: 0px')
  modal.querySelector(".modal__addContact-btn").style.display = "inline-block"
  modal.querySelector(".modal__save-btn").innerHTML = "Сохранить"
  modal.querySelector(".modal__error").textContent = ""
  modal.reset()
  modalListWrap.classList.remove("modal__list-wrap_fill")
  modalList.innerHTML = ""
}

function buildModalEdit(user) {
  userEditBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.7" clip-path="url(#clip0_121_2285)">
      <path d="M2 11.5V14H4.5L11.8733 6.62662L9.37333 4.12662L2 11.5ZM13.8067 4.69329C14.0667 4.43329 14.0667 4.01329 13.8067 3.75329L12.2467 2.19329C11.9867 1.93329 11.5667 1.93329 11.3067 2.19329L10.0867 3.41329L12.5867 5.91329L13.8067 4.69329Z" fill="#9873FF"/>
      </g> 
      <defs>
      <clipPath id="clip0_121_2285">
      <rect width="16" height="16" fill="white"/>
      </clipPath>
      </defs>
    </svg>Изменить`
  resetModal()
  modal.dataset.state = `edt${user.id}`
  let span = document.createElement("span")
  span.className = "modal__title-id"
  span.innerHTML = `ID: ${user.id}`
  modal.querySelector(".modal__title").innerHTML = "Изменить данные "
  modal.querySelector(".modal__title").append(span)
  inputSurname.value = user.surname
  inputName.value = user.name
  inputLastname.value = user.lastName
  modal.querySelectorAll(".modal__label").forEach(item => item.style.cssText = 'font-size: 10px; top: -10px')
  for (let i = 0; i < user.contacts.length; i++) {
    modalList.append(addContactItem(user.contacts[i]))
  }
  modal.querySelector(".modal__save-btn").innerHTML = "Сохранить"
  modal.querySelector(".modal__cancel-btn").innerHTML = "Удалить клиента"
  if (modalList.children.length != 0) modalListWrap.classList.add("modal__list-wrap_fill")
  displayModal()
}

function showModalDelete(userId) {
  document.querySelectorAll(".modal__field > input").forEach(input => input.required = false)
  modal.dataset.state = `del${userId}`
  modal.querySelector(".modal__title").innerHTML = "Удалить клиента"
  modal.querySelector(".modal__title").style.textAlign = "center"
  modal.querySelector(".modal__save-btn").innerHTML = "Удалить"
  modal.querySelector(".modal__cancel-btn").innerHTML = "Отмена"
  modal.querySelectorAll(".modal__field").forEach(item => item.style.display = "none")
  modal.querySelector(".modal__list-wrap").style.display = "none"
  let p = document.createElement("p")
  p.className = "modal__delete-text"
  p.textContent = "Вы действительно хотите удалить данного клиента?"
  p.style.textAlign = "center"
  modal.querySelector(".modal__title").after(p)
  displayModal()
}

function addContactItem(data = undefined) {
  let dataItem = {}
  if (data == undefined) {
    dataItem.type = "Телефон"
    dataItem.value = ""
  } else {
    dataItem.type = data.type
    dataItem.value = data.value
  }

  const typeContacts = ["Телефон", "Email", "Facebook", "VK", "Другое"]
  let li = document.createElement("li")
  li.className = "modal__item contact"

  let selectContact = document.createElement("select")
  for (let i = 0; i < 5; i++) {
    let option = Object.assign(document.createElement("option"), {
      className: "contact__option",
      value: typeContacts[i],
      innerHTML: typeContacts[i],
      selected: dataItem.type == typeContacts[i]
    })
    selectContact.append(option)
  }
  selectContact.className = "contact__select"
  let inputContact = document.createElement("input")
  selectContact.addEventListener("change", () => handleChangeSelectContact(inputContact, selectContact.value, ""))

  inputContact.placeholder = "Введите данные контакта"
  inputContact.className = "contact__input"
  handleChangeSelectContact(inputContact, dataItem.type, dataItem.value)
  inputContact.required = true

  let btnContact = document.createElement("button")
  btnContact.className = "btn-reset contact__delete"
  btnContact.innerHTML = `
		<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
			<path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#B0B0B0"/>
		</svg>
	`
  let title = document.createElement("span")
  title.className = "contact__delete-title"
  title.innerHTML = "Удалить контакт"
  btnContact.addEventListener("click", function (e) {
    li.remove()
    if (modalList.innerHTML === "") modalListWrap.classList.remove("modal__list-wrap_fill")
    if (modalList.children.length == 9) document.querySelector(".modal__addContact-btn").style.display = "inline-block"
  })
  btnContact.prepend(title)
  li.append(selectContact, inputContact, btnContact)
  return li
}

function handleChangeSelectContact(input, type, value) {
  let inputValue = value == "" ? type == "Телефон" ? "+7" : value : value
  switch (type) {
    case "Телефон":
      input.type = "tel"
      input.title = "Формат: +79993331122"
      input.value = inputValue
      input.setAttribute("pattern", "\\+7\\d{10}")
      break
    case "Email":
      input.type = "email"
      input.value = inputValue
      input.title = "Формат: ivanovii@mail.ru"
      input.setAttribute("pattern", "[A-z0-9\\-]+@[A-z]+\\.[A-z]+")
      break
    case "Facebook":
      input.type = "text"
      input.value = inputValue
      input.title = "Формат: www.facebook.com/ivan_ii"
      input.setAttribute("pattern", ".*www.facebook.com/.+")
      break
    case "VK":
      input.type = "text"
      input.value = inputValue
      input.title = "Формат: www.vk.com/ivan_ii"
      input.setAttribute("pattern", ".*www.vk.com/.+")
      break
    default:
      input.type = "text"
      input.value = inputValue
      input.setAttribute("pattern", ".+")
      break
  }
}

modal.addEventListener("submit", function (e) {
  e.preventDefault()
  if (modal.dataset.state.startsWith("del")) {
    modal.append(modalDisableDiv)
    deleteUser(modal.dataset.state.slice(3))
    return
  }
  let valueSurname = inputSurname.value.trim()
  let valueName = inputName.value.trim()
  let valueLastname = inputLastname.value.trim()
  const contactsList = Array.from(modalList.querySelectorAll("li")).map(li => (
    {
      type: li.children[0].value,
      value: li.children[1].value.trim()
    }
  ))
  const newUser = {
    surname: valueSurname,
    name: valueName,
    lastName: valueLastname,
    contacts: [...contactsList]
  }
  document.querySelector(".modal__save-btn").innerHTML = `
    <svg class="modal__save-btn-loading" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_121_1254)">
      <path d="M3.00008 8.03996C3.00008 10.8234 5.2566 13.08 8.04008 13.08C10.8236 13.08 13.0801 10.8234 13.0801 8.03996C13.0801 5.25648 10.8236 2.99996 8.04008 2.99996C7.38922 2.99996 6.7672 3.1233 6.196 3.348" stroke="#B89EFF" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
      </g>
      <defs>
      <clipPath id="clip0_121_1254">
      <rect width="16" height="16" fill="white"/>
      </clipPath>
      </defs>
    </svg>Сохранить`
  modal.append(modalDisableDiv)
  if (modal.dataset.state == "new") {
    addNewUser(newUser)
  } else {
    editUser(modal.dataset.state.slice(3), newUser)
  }
})

function getUserDate(date) {
  let formattedDate = new Date(date)
  return `${("0" + formattedDate.getDate()).slice(-2)}.${("0" + (formattedDate.getMonth() + 1)).slice(-2)}.${formattedDate.getFullYear()}`
}

function getUserTime(date) {
  let formattedDate = new Date(date)
  return `${("0" + formattedDate.getHours()).slice(-2)}:${("0" + formattedDate.getMinutes()).slice(-2)}`
}

function hideLoadingUsers() {
  trLoading.style.display = "none"
}

function showLoadingUsers() {
  trLoading.style.display = "table-row"
}

function resetToStart() {
  hideModal()
  resetModal()
  clearTableBody()
  showLoadingUsers()
}

function clearTableBody() {
  trLoading = tableTbody.children[0]
  tableTbody.innerHTML = ""
  tableTbody.append(trLoading)
}

function showErrorFetch(operation, errMessage) {
  if (operation == "edt")
    document.querySelector(".modal__save-btn").innerHTML = `Сохранить`
  else
    document.querySelector(".modal__save-btn").innerHTML = `Удалить`
  modalDisableDiv.remove()
  modal.querySelector(".modal__error").textContent = `Error: ${errMessage || 'Что-то пошло не так'}`
}

function buildContactsList(ul, contacts, all = false) {
  let start = all ? 4 : 0
  let end = all ? contacts.length : contacts.length < 4 ? contacts.length : 4
  let contactsNodes = []
  for (let i = start; i < end; i++) {
    let li = document.createElement("li")
    li.className = "table__contact"

    let title = document.createElement("span")
    title.className = "table__contact-title"
    title.innerHTML = contacts[i].type + ": " + contacts[i].value
    switch (contacts[i].type) {
      case "Телефон":
        li.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.7">
              <circle cx="8" cy="8" r="8" fill="#9873FF"/>
              <path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/>
            </g>
          </svg>
        `
        break
      case "Email":
        li.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/>
          </svg>
        `
        break
      case "Facebook":
        li.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.7" d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/>
          </svg>
        `
        break
      case "VK":
        li.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.7" d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"/>
          </svg>
        `
        break
      default:
        li.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z" fill="#9873FF"/>
          </svg>
        `
        break
    }
    li.prepend(title)
    contactsNodes.push(li)
  }
  return contactsNodes
}

function displayListUsers(users) {
  usersList = JSON.parse(JSON.stringify(users))
  clearTableBody()
  usersList.forEach(user => {
    let userRow = document.createElement("tr")
    userRow.className = "table__row"
    // userRow.dataset.id = user.id
    let td = document.createElement("td")
    td.className = "table__id"
    td.innerHTML = user.id
    userRow.append(td)

    td = document.createElement("td")
    td.innerHTML = `${user.surname} ${user.name} ${user.lastName}`
    userRow.append(td)

    td = document.createElement("td")
    let spanDate = document.createElement("span")
    spanDate.innerHTML = getUserDate(user.createdAt)
    spanDate.className = "table__date"
    let spanTime = document.createElement("span")
    spanTime.innerHTML = getUserTime(user.createdAt)
    spanTime.className = "table__time"
    td.append(spanDate, spanTime)
    userRow.append(td)

    td = document.createElement("td")
    spanDate = document.createElement("span")
    spanDate.innerHTML = getUserDate(user.updatedAt)
    spanDate.className = "table__date"
    spanTime = document.createElement("span")
    spanTime.innerHTML = getUserTime(user.updatedAt)
    spanTime.className = "table__time"
    td.append(spanDate, spanTime)
    userRow.append(td)

    td = document.createElement("td")
    let ul = document.createElement("ul")
    ul.className = "list-reset table__contacts"
    ul.append(...buildContactsList(ul, user.contacts))
    if(user.contacts.length > 4){
      let li = document.createElement("li")
      li.className = "table__contact"
      li.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="7.5" stroke="#9873FF"/>
        </svg><span class="table__contactMore">+${user.contacts.length - 4}</span>
      `
      li.addEventListener("click", function () {
        ul.removeChild(ul.lastElementChild)
        ul.append(...buildContactsList(ul, user.contacts, true))
      })
      ul.append(li)
    }
    td.append(ul)
    userRow.append(td)

    td = document.createElement("td")
    let btnEdit = document.createElement("button")
    btnEdit.className = "btn-reset table__edit-btn"
    btnEdit.innerHTML = `
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<g opacity="0.7" clip-path="url(#clip0_121_2285)">
				<path d="M2 11.5V14H4.5L11.8733 6.62662L9.37333 4.12662L2 11.5ZM13.8067 4.69329C14.0667 4.43329 14.0667 4.01329 13.8067 3.75329L12.2467 2.19329C11.9867 1.93329 11.5667 1.93329 11.3067 2.19329L10.0867 3.41329L12.5867 5.91329L13.8067 4.69329Z" fill="#9873FF"/>
				</g> 
				<defs>
				<clipPath id="clip0_121_2285">
				<rect width="16" height="16" fill="white"/>
				</clipPath>
				</defs>
			</svg>Изменить`

    btnEdit.addEventListener("click", () => {
      userEditBtn = btnEdit
      btnEdit.innerHTML = `
        <svg class="table__edit-btn-loading" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_121_1937)">
        <path d="M3.00008 8.03996C3.00008 10.8234 5.2566 13.08 8.04008 13.08C10.8236 13.08 13.0801 10.8234 13.0801 8.03996C13.0801 5.25648 10.8236 2.99996 8.04008 2.99996C7.38922 2.99996 6.7672 3.1233 6.196 3.348" stroke="#9873FF" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
        </g>
        <defs>
        <clipPath id="clip0_121_1937">
        <rect width="16" height="16" fill="white"/>
        </clipPath>
        </defs>
        </svg>Изменить`
      getUser(user.id)
    })

    td.append(btnEdit)
    let btnDelete = document.createElement("button")
    btnDelete.className = "btn-reset table__del-btn"
    btnDelete.innerHTML = `
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<g opacity="0.7" clip-path="url(#clip0_121_2473)">
				<path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#F06A4D"/>
				</g>
				<defs>
				<clipPath id="clip0_121_2473">
				<rect width="16" height="16" fill="white"/>
				</clipPath>
				</defs>
			</svg>Удалить`
    btnDelete.addEventListener("click", () => {
      showModalDelete(user.id)
    })
    td.append(btnDelete)
    userRow.append(td)

    tableTbody.append(userRow)
  })
}

async function getUsers() {
  let users
  const response = await fetch("http://localhost:3000/api/clients")
  if (response.ok) {
    users = await response.json()
    users.sort((a, b) => a.id - b.id)
    hideLoadingUsers()
    displayListUsers(users)
  } else {
    alert("Error: " + response.statusText)
  }
}

async function addNewUser(newUser) {
  const response = await fetch("http://localhost:3000/api/clients", {
    method: "POST",
    body: JSON.stringify(newUser)
  })
  if (!response.ok) {
    showErrorFetch("new", response.statusText)
    return
  }
  resetToStart()
  getUsers()
}

async function getUser(userId) {
  const response = await fetch(`http://localhost:3000/api/clients/${userId}`)
  const user = await response.json()
  buildModalEdit(user)
}

async function deleteUser(userId) {
  const response = await fetch(`http://localhost:3000/api/clients/${userId}`, { method: "DELETE" })
  if (!response.ok) {
    showErrorFetch("del", response.statusText)
    return
  }
  resetToStart()
  getUsers()
}

async function editUser(userId, editedUser) {
  const response = await fetch(`http://localhost:3000/api/clients/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(editedUser)
  })
  if (!response.ok) {
    showErrorFetch("edt", response.statusText)
    return
  }
  resetToStart()
  getUsers()
}

async function getUsersByFilter(filter) {
  const response = await fetch(`http://localhost:3000/api/clients?search=${filter}`)
  const users = await response.json()
  users.sort((a, b) => a.id - b.id)
  hideLoadingUsers()
  displayListUsers(users)
}

getUsers()