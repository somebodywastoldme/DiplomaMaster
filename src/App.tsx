
import { Flex } from '@chakra-ui/react'
import './App.css'
import OntologyAnalysisContainer from './components/OntologyAnalysisApp/OntologyAnalysisContainer'

function App() {
  return (
    <Flex w={'100%'} h={'100%'} backgroundColor={'blue.400'}>
      <OntologyAnalysisContainer/>
    </Flex>
  )
}

export default App
