import { useRouter } from 'next/router'
import { FormEvent, useCallback, useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'

const SearchBox = () => {
  const [keyword, setKeyword] = useState('')
  const [focus, setFocus] = useState(false)
  const router = useRouter()
  const page = router.query.page

  const searchHandler = useCallback(() => {
    if (!keyword.trim()) {
      router.push('/')
      return
    }
    router.push(
      page ? `/?keyword=${keyword}&page=${page}` : `/?keyword=${keyword}`
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, page])

  useEffect(() => {
    let timed: NodeJS.Timeout
    if (focus) timed = setTimeout(searchHandler, 500)

    return () => clearTimeout(timed)
  }, [searchHandler, focus])

  const submitHandler = (e: FormEvent) => {
    e.preventDefault()
    searchHandler()
  }

  return (
    <Form onSubmit={submitHandler}>
      <Row>
        <Col sm={9}>
          <Form.Control
            type="text"
            name="q"
            onBlur={() => setFocus(false)}
            onFocus={() => setFocus(true)}
            onChange={e => setKeyword(e.target.value)}
            placeholder="search products..."
          />
        </Col>
        <Col sm={3}>
          <Button type="submit" variant="outline-success">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default SearchBox
