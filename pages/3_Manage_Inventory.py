import streamlit as st
import csv


# Check for authentication status
if st.session_state.get("authentication_status") != True:
    st.error("⛔ You must log in to access this page.")
    st.stop()

# Divider for adding a new item
st.markdown("---")  # Divider
st.subheader("Add New Item")
# Load locations from locations.csv
locations = []
try:
    with open('locations.csv', newline='') as loc_file:
        loc_reader = csv.reader(loc_file)
        locations = [row[0].strip() for row in loc_reader]  # Read and strip locations
except FileNotFoundError:
    st.write("The locations file does not exist.")

# Create text boxes for new item input
new_item = st.text_input("Enter item name:")
new_location = st.selectbox("Select item location:", locations)  # Change to dropdown

# Add a button to save the new item
if st.button('Add Item'):
    if new_item and new_location:  # Check if both fields are filled
        with open('items.csv', 'a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([new_item.strip(), new_location])  # Write new item and location
        st.success(f'Added: {new_item} at {new_location}')
    else:
        st.warning("Please fill in both fields.")

# Divider for deleting an item
st.markdown("---")  # Divider
st.subheader("Delete Item")
# Load items from items.csv for deletion
items_to_delete = []
try:
    with open('items.csv', newline='') as csvfile:
        reader = csv.reader(csvfile)
        items_to_delete = [row for row in reader]  # Read all rows
except FileNotFoundError:
    st.write("The items file does not exist.")

# Create a list of item names for the dropdown
item_names = [row[0].strip() for row in items_to_delete]  # Get the first column for dropdown

# Dropdown to select an item to delete
item_to_delete = st.selectbox("Select item to delete:", item_names)

# Add a button to delete the selected item
if st.button('Delete'):
    if item_to_delete:  # Check if an item is selected
        # Filter out the selected item while preserving the second column
        remaining_items = [row for row in items_to_delete if row[0] != item_to_delete]
        
        # Write the remaining items back to items.csv
        with open('items.csv', 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerows(remaining_items)  # Write remaining items
        
        st.success(f'Deleted: {item_to_delete}')
    else:
        st.warning("Please select an item to delete.")

# Divider for updating an item
st.markdown("---")  # Divider
st.subheader("Update Item Location")
# Load items from items.csv for updating
items_to_update = []
try:
    with open('items.csv', newline='') as csvfile:
        reader = csv.reader(csvfile)
        items_to_update = [row for row in reader]  # Read all rows
except FileNotFoundError:
    st.write("The items file does not exist.")

# Create a list of item names for the dropdown
item_names = [row[0].strip() for row in items_to_update]  # Get the first column for dropdown

# Load locations from locations.csv
locations = []
try:
    with open('locations.csv', newline='') as loc_file:
        loc_reader = csv.reader(loc_file)
        locations = [row[0].strip() for row in loc_reader]  # Read and strip locations
except FileNotFoundError:
    st.write("The locations file does not exist.")

# Dropdown to select an item to update
item_to_update = st.selectbox("Select item to update:", item_names)

# Dropdown to select a new location
new_location = st.selectbox("Select new location:", locations)

# Add a button to update the selected item's location
if st.button('Update Location'):
    if item_to_update and new_location:  # Check if both fields are filled
        # Update the item's location in the items list
        for row in items_to_update:
            if row[0] == item_to_update:
                row[1] = new_location  # Update the second column with the new location
                break
        
        # Write the updated items back to items.csv
        with open('items.csv', 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerows(items_to_update)  # Write all items back
        
        st.success(f'Updated: {item_to_update} to new location: {new_location}')
    else:
        st.warning("Please select an item and a new location.")

# Existing code...