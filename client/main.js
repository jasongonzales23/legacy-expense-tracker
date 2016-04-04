import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Budgets } from '../collections/budgets';
import { Entries } from '../collections/entries';

import './main.html';

Template.Home.events({
  "click #add-this": function(evt, templ) {
    var amount, amountInput, description, descriptionInput, timestamp;
    amountInput = templ.find("#expense-amount");
    descriptionInput = templ.find("#expense-description");
    amount = parseInt(amountInput.value);
    description = descriptionInput.value;
    amountInput.value = "";
    descriptionInput.value = "";
    timestamp = new Date().valueOf();
    return Entries.insert({
      description: description,
      amount: amount,
      createdAt: timestamp
    });
  }
});

Template.Home.helpers({
  budget() {
    var amounts, amountsTotal, currentMonthEntries, end, mostRecentBudget, now, nowDay, nowMonth, nowYear, start;
    now = new Date();
    nowYear = now.getFullYear();
    nowMonth = now.getMonth();
    nowDay = now.getDate();
    start = new Date(nowYear, nowMonth, 1).getTime();
    end = new Date(nowYear, nowMonth + 1, 1).getTime();

    mostRecentBudget = Budgets.find({}, {
      sort: {
        createdAt: -1
      },
      limit: 1
    }).fetch();

    currentMonthEntries = Entries.find({
      createdAt: {
        $gte: start,
        $lt: end
      }
    }).fetch();

    if (currentMonthEntries.length > 0 ) {
      amounts = _.pluck(currentMonthEntries, "amount");
      amountsTotal = _.reduce(amounts, function(memo, num) {
        return memo + num;
      });
      return mostRecentBudget[0].amount - amountsTotal;
    } else {
      return mostRecentBudget[0].amount;
    }

    if (mostRecentBudget.length == 0) {
      return 'not computed';
    }
  }
});

Template.Budget.events({
  "click #add-this": function(evt, templ) {
    var amount, amountInput, description, descriptionInput, timestamp;
    amountInput = templ.find("#budget-amount");
    descriptionInput = templ.find("#budget-description");
    amount = parseInt(amountInput.value);
    description = descriptionInput.value;
    amountInput.value = "";
    descriptionInput.value = "";
    timestamp = new Date().valueOf();
    return Budgets.insert({
      description: description,
      amount: amount,
      createdAt: timestamp
    });
  }
});

Template.Budget.helpers({
  budgets() {
    return Budgets.find({});
  }
});
