import React from 'react'

const Filter = ({handleFilterChange, filterName}) => {
    return (
      <div>
      filter show with <input  value={filterName}
      onChange={handleFilterChange}
      /></div>
    )
  }


  export default Filter