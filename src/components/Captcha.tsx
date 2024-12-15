import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Text,
  Input,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { RepeatIcon } from '@chakra-ui/icons'

interface CaptchaProps {
  onVerify: (verified: boolean) => void
}

export default function Captcha({ onVerify }: CaptchaProps) {
  const [captchaText, setCaptchaText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const bgColor = useColorModeValue('gray.50', 'gray.700')

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptchaText(result)
    setUserInput('')
    setIsVerified(false)
    onVerify(false)
  }

  useEffect(() => {
    generateCaptcha()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setUserInput(input)
    
    if (input === captchaText) {
      setIsVerified(true)
      onVerify(true)
    } else {
      setIsVerified(false)
      onVerify(false)
    }
  }

  return (
    <VStack spacing={4} align="stretch">
      <Box
        p={4}
        bg={bgColor}
        borderRadius="md"
        position="relative"
        letterSpacing="wider"
      >
        <Text
          fontSize="xl"
          fontFamily="monospace"
          fontWeight="bold"
          textAlign="center"
          style={{
            textDecoration: 'line-through',
            textDecorationStyle: 'wavy',
            textDecorationColor: useColorModeValue('gray.500', 'gray.300'),
          }}
        >
          {captchaText}
        </Text>
        <Button
          size="sm"
          position="absolute"
          right={2}
          top="50%"
          transform="translateY(-50%)"
          onClick={generateCaptcha}
          variant="ghost"
        >
          <RepeatIcon />
        </Button>
      </Box>

      <Input
        placeholder="Ingresa el código"
        value={userInput}
        onChange={handleInputChange}
        isInvalid={userInput !== '' && !isVerified}
        bg="white"
      />

      {userInput !== '' && (
        <Text
          color={isVerified ? 'green.500' : 'red.500'}
          fontSize="sm"
          textAlign="center"
        >
          {isVerified ? '¡Verificación exitosa!' : 'Código incorrecto'}
        </Text>
      )}
    </VStack>
  )
}
