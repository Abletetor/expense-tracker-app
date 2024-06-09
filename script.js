document.addEventListener('DOMContentLoaded', () => {
     const expenseForm = document.getElementById('expense-form');
     const expenseName = document.getElementById('expense-name');
     const expenseAmount = document.getElementById('expense-amount');
     const expenseCategory = document.getElementById('expense-category');
     const expenseDate = document.getElementById('expense-date');
     const expenseList = document.getElementById('expense-list');
     const totalExpenses = document.getElementById('total-expenses');
     const categorySummary = document.getElementById('category-summary');
     const filterForm = document.getElementById('filter-form');
     const filterStartDate = document.getElementById('filter-start-date');
     const filterEndDate = document.getElementById('filter-end-date');

     // Load expenses from local storage
     let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

     const updateTotalExpenses = () => {
          const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
          totalExpenses.textContent = `Total Expenses: GH¢${total.toFixed(2)}`;
     };

     const updateCategorySummary = () => {
          const categoryTotals = expenses.reduce((acc, expense) => {
               acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
               return acc;
          }, {});
          categorySummary.innerHTML = '<h3>Category Summary</h3>';
          for (const [category, total] of Object.entries(categoryTotals)) {
               const p = document.createElement('p');
               p.textContent = `${category}: GH¢${total.toFixed(2)}`;
               categorySummary.appendChild(p);
          }
     };

     // Save expense to local storage
     const saveExpenses = () => {
          localStorage.setItem('expenses', JSON.stringify(expenses));
     };

     // Delete expense
     window.removeExpense = (index) => {
          expenses.splice(index, 1);
          renderExpenses();
     };

     // Displaying the expense list
     const renderExpenses = (filteredExpenses = expenses) => {
          expenseList.innerHTML = '';
          filteredExpenses.forEach((expense, index) => {
               const li = document.createElement('li');
               li.innerHTML = `
                ${expense.name} - GH¢${parseFloat(expense.amount).toFixed(2)} - ${expense.date} [ ${expense.category}]
                <button onclick="removeExpense(${index})" class="btn-delete"><svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 0 24 24" width="15px" fill="#fff"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button>
            `;
               expenseList.appendChild(li);
          });
          updateTotalExpenses();
          updateCategorySummary();
          saveExpenses();
     };

     expenseForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = expenseName.value;
          const amount = expenseAmount.value;
          const category = expenseCategory.value;
          const date = expenseDate.value;

          if (name && amount && date && category) {
               expenses.push({ name, amount, date, category });
               renderExpenses();
               expenseForm.reset();
          } else {
               alert('Please fill out all fields.');
          }
     });

     filterForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const startDate = new Date(filterStartDate.value);
          const endDate = new Date(filterEndDate.value);

          const filteredExpenses = expenses.filter(expense => {
               const expenseDate = new Date(expense.date);
               return (!isNaN(startDate) ? expenseDate >= startDate : true) &&
                    (!isNaN(endDate) ? expenseDate <= endDate : true);
          });
          renderExpenses(filteredExpenses);
     });

     renderExpenses();

     // footer year
     document.getElementById("footer-year").innerHTML = new Date().getFullYear();
});
