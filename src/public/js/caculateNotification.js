function increaseNumberNotifContact(classname) {
	let currentValue = parseInt($(`.${classname}`).find('em').text(), 10);
	if (!currentValue) currentValue = 0;
	currentValue++;
	$(`.${classname}`).html(`(<em>${currentValue}</em>)`);
}

function decreaseNumberNotifContact(classname) {
	let currentValue = parseInt($(`.${classname}`).find('em').text(), 10);
	currentValue--;
	if (currentValue === 0) {
		$(`.${classname}`).html(null);
	} else {
		$(`.${classname}`).html(`(<em>${currentValue}</em>)`);
	}
}

function increaseNumberNotification(classname) {
  let currentValue = parseInt($(`.${classname}`).text(), 10);
	if (!currentValue) currentValue = 0;
	currentValue++;
	$(`.${classname}`).css('display', 'block').html(currentValue);
}

function decreaseNumberNotification(classname) {
  let currentValue = parseInt($(`.${classname}`).text(), 10);
	currentValue--;
	if (currentValue === 0) {
		$(`.${classname}`).css('display', 'none').html(null);
	} else {
		$(`.${classname}`).css('display', 'block').html(currentValue);
	}
}
