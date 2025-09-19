import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import Icon from '@/components/ui/icon'

interface Skill {
  id: string
  name: string
  level: number
  currentXP: number
  requiredXP: number
  xpPerUnit: number
}

interface Goal {
  id: string
  title: string
  reward: number
  completed: boolean
  linkedSkillId: string
}

interface Player {
  name: string
  level: number
  currentXP: number
  requiredXP: number
  totalXP: number
}

function Index() {
  const [activeTab, setActiveTab] = useState('main')
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  
  const [player, setPlayer] = useState<Player>({
    name: 'Игрок',
    level: 1,
    currentXP: 417,
    requiredXP: 1470,
    totalXP: 417
  })

  const [skills, setSkills] = useState<Skill[]>([
    {
      id: '1',
      name: 'Бег',
      level: 2,
      currentXP: 115,
      requiredXP: 200,
      xpPerUnit: 10
    },
    {
      id: '2', 
      name: 'Listening',
      level: 1,
      currentXP: 50,
      requiredXP: 100,
      xpPerUnit: 10
    },
    {
      id: '3',
      name: 'Словарный запас',
      level: 1,
      currentXP: 10,
      requiredXP: 100,
      xpPerUnit: 10
    },
    {
      id: '4',
      name: 'Speaking',
      level: 1,
      currentXP: 26,
      requiredXP: 100,
      xpPerUnit: 10
    }
  ])

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Выучить 5 слов (+10 XP)',
      reward: 10,
      completed: false,
      linkedSkillId: '3'
    }
  ])

  const [isAddingSkill, setIsAddingSkill] = useState(false)
  const [isAddingGoal, setIsAddingGoal] = useState(false)
  const [newSkill, setNewSkill] = useState({ name: '', requiredXP: 100, xpPerUnit: 10 })
  const [newGoal, setNewGoal] = useState({ title: '', reward: 10, linkedSkillId: '' })

  const calculatePlayerLevelXP = (level: number) => {
    return Math.floor(1000 * Math.pow(1.2, level - 1))
  }

  const calculateSkillLevelXP = (level: number) => {
    return Math.floor(100 * Math.pow(1.15, level - 1))
  }

  const addXPToSkill = (skillId: string, amount: number) => {
    setSkills(prevSkills => 
      prevSkills.map(skill => {
        if (skill.id === skillId) {
          let newCurrentXP = skill.currentXP + amount
          let newLevel = skill.level
          let newRequiredXP = skill.requiredXP

          while (newCurrentXP >= newRequiredXP) {
            newCurrentXP -= newRequiredXP
            newLevel++
            newRequiredXP = calculateSkillLevelXP(newLevel)
          }

          addPlayerXP(amount)

          return {
            ...skill,
            level: newLevel,
            currentXP: newCurrentXP,
            requiredXP: newRequiredXP
          }
        }
        return skill
      })
    )
  }

  const addPlayerXP = (amount: number) => {
    setPlayer(prevPlayer => {
      let newCurrentXP = prevPlayer.currentXP + amount
      let newLevel = prevPlayer.level
      let newRequiredXP = prevPlayer.requiredXP
      let newTotalXP = prevPlayer.totalXP + amount

      while (newCurrentXP >= newRequiredXP) {
        newCurrentXP -= newRequiredXP
        newLevel++
        newRequiredXP = calculatePlayerLevelXP(newLevel)
      }

      return {
        ...prevPlayer,
        level: newLevel,
        currentXP: newCurrentXP,
        requiredXP: newRequiredXP,
        totalXP: newTotalXP
      }
    })
  }

  const addSkill = () => {
    if (newSkill.name.trim()) {
      const skill: Skill = {
        id: Date.now().toString(),
        name: newSkill.name,
        level: 1,
        currentXP: 0,
        requiredXP: newSkill.requiredXP,
        xpPerUnit: newSkill.xpPerUnit
      }
      setSkills([...skills, skill])
      setNewSkill({ name: '', requiredXP: 100, xpPerUnit: 10 })
      setIsAddingSkill(false)
    }
  }

  const addGoal = () => {
    if (newGoal.title.trim() && newGoal.linkedSkillId) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        reward: newGoal.reward,
        completed: false,
        linkedSkillId: newGoal.linkedSkillId
      }
      setGoals([...goals, goal])
      setNewGoal({ title: '', reward: 10, linkedSkillId: '' })
      setIsAddingGoal(false)
    }
  }

  const completeGoal = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId)
    if (goal && !goal.completed) {
      addXPToSkill(goal.linkedSkillId, goal.reward)
      setGoals(prevGoals =>
        prevGoals.map(g =>
          g.id === goalId ? { ...g, completed: true } : g
        )
      )
    }
  }

  const deleteSkill = (skillId: string) => {
    setSkills(skills.filter(s => s.id !== skillId))
    setGoals(goals.filter(g => g.linkedSkillId !== skillId))
    if (selectedSkill === skillId) {
      setSelectedSkill(null)
    }
  }

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter(g => g.id !== goalId))
  }

  return (
    <div className="min-h-screen bg-rpg-dark text-white">
      <div className="container mx-auto p-6">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-orbitron font-bold text-rpg-purple">RPG-Life Tracker</h1>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="bg-rpg-card border-rpg-border">
              <TabsTrigger value="main" className="data-[state=active]:bg-rpg-purple">Главная</TabsTrigger>
              <TabsTrigger value="rewards" className="data-[state=active]:bg-rpg-purple">Награды</TabsTrigger>
            </TabsList>
          </Tabs>
        </header>

        <TabsContent value="main" className="space-y-6">
          {/* Player Stats */}
          <Card className="bg-rpg-card border-rpg-border">
            <CardHeader>
              <div className="flex justify-between items-center">
                <Input
                  value={player.name}
                  onChange={(e) => setPlayer({ ...player, name: e.target.value })}
                  className="text-lg font-semibold bg-transparent border-none text-white p-0 h-auto"
                />
                <Badge variant="secondary" className="bg-rpg-purple text-white">
                  Уровень: {player.level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress 
                  value={(player.currentXP / player.requiredXP) * 100} 
                  className="h-4"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{player.currentXP} / {player.requiredXP} XP</span>
                  <span>Общий XP: {player.totalXP}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills Section */}
            <Card className="bg-rpg-card border-rpg-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-rpg-green flex items-center gap-2">
                  <Icon name="Plus" size={20} />
                  Навыки
                </CardTitle>
                <Dialog open={isAddingSkill} onOpenChange={setIsAddingSkill}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-rpg-green hover:bg-rpg-green/80">
                      <Icon name="Plus" size={16} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-rpg-card border-rpg-border text-white">
                    <DialogHeader>
                      <DialogTitle>Добавить навык</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Название навыка</Label>
                        <Input
                          value={newSkill.name}
                          onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                          className="bg-rpg-dark border-rpg-border"
                        />
                      </div>
                      <div>
                        <Label>Опыт для 1 уровня</Label>
                        <Input
                          type="number"
                          value={newSkill.requiredXP}
                          onChange={(e) => setNewSkill({ ...newSkill, requiredXP: parseInt(e.target.value) || 100 })}
                          className="bg-rpg-dark border-rpg-border"
                        />
                      </div>
                      <div>
                        <Label>XP за единицу</Label>
                        <Input
                          type="number"
                          value={newSkill.xpPerUnit}
                          onChange={(e) => setNewSkill({ ...newSkill, xpPerUnit: parseInt(e.target.value) || 10 })}
                          className="bg-rpg-dark border-rpg-border"
                        />
                      </div>
                      <Button onClick={addSkill} className="bg-rpg-green hover:bg-rpg-green/80">
                        Добавить
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-5 gap-2 text-sm text-gray-400 font-semibold">
                    <span>Название</span>
                    <span>Ур.</span>
                    <span>Опыт</span>
                    <span>XP/ед.</span>
                    <span>Действия</span>
                  </div>
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className={`grid grid-cols-5 gap-2 p-3 rounded cursor-pointer transition-colors ${
                        selectedSkill === skill.id ? 'bg-rpg-purple/20 border border-rpg-purple' : 'hover:bg-gray-700'
                      }`}
                      onClick={() => setSelectedSkill(selectedSkill === skill.id ? null : skill.id)}
                    >
                      <span className="font-medium">{skill.name}</span>
                      <span>{skill.level}</span>
                      <span className="text-sm">{skill.currentXP} / {skill.requiredXP}</span>
                      <span>{skill.xpPerUnit}</span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-rpg-orange/20"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Edit functionality can be added here
                          }}
                        >
                          <Icon name="Edit" size={12} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-red-500/20"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteSkill(skill.id)
                          }}
                        >
                          <Icon name="Trash2" size={12} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedSkill && (
                  <div className="mt-6 p-4 bg-rpg-purple/10 border border-rpg-purple rounded">
                    <h4 className="font-semibold mb-3">Добавить прогресс</h4>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => addXPToSkill(selectedSkill, 1 * skills.find(s => s.id === selectedSkill)!.xpPerUnit)}
                        className="bg-rpg-green hover:bg-rpg-green/80"
                      >
                        +1
                      </Button>
                      <Button
                        onClick={() => addXPToSkill(selectedSkill, 5 * skills.find(s => s.id === selectedSkill)!.xpPerUnit)}
                        className="bg-rpg-green hover:bg-rpg-green/80"
                      >
                        +5
                      </Button>
                      <Button
                        onClick={() => addXPToSkill(selectedSkill, 10 * skills.find(s => s.id === selectedSkill)!.xpPerUnit)}
                        className="bg-rpg-green hover:bg-rpg-green/80"
                      >
                        +10
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Goals Section */}
            <Card className="bg-rpg-card border-rpg-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-rpg-orange flex items-center gap-2">
                  <Icon name="Plus" size={20} />
                  Цели для: Словарный запас
                </CardTitle>
                <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-rpg-orange hover:bg-rpg-orange/80">
                      <Icon name="Plus" size={16} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-rpg-card border-rpg-border text-white">
                    <DialogHeader>
                      <DialogTitle>Добавить цель</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Название цели</Label>
                        <Input
                          value={newGoal.title}
                          onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                          className="bg-rpg-dark border-rpg-border"
                        />
                      </div>
                      <div>
                        <Label>Награда (XP)</Label>
                        <Input
                          type="number"
                          value={newGoal.reward}
                          onChange={(e) => setNewGoal({ ...newGoal, reward: parseInt(e.target.value) || 10 })}
                          className="bg-rpg-dark border-rpg-border"
                        />
                      </div>
                      <div>
                        <Label>Связанный навык</Label>
                        <select
                          value={newGoal.linkedSkillId}
                          onChange={(e) => setNewGoal({ ...newGoal, linkedSkillId: e.target.value })}
                          className="w-full p-2 bg-rpg-dark border border-rpg-border rounded text-white"
                        >
                          <option value="">Выберите навык</option>
                          {skills.map(skill => (
                            <option key={skill.id} value={skill.id}>{skill.name}</option>
                          ))}
                        </select>
                      </div>
                      <Button onClick={addGoal} className="bg-rpg-orange hover:bg-rpg-orange/80">
                        Добавить
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {goals.map((goal) => (
                    <div
                      key={goal.id}
                      className={`p-3 rounded border transition-all ${
                        goal.completed 
                          ? 'bg-rpg-green/10 border-rpg-green line-through opacity-60' 
                          : 'bg-gray-700/50 border-rpg-border hover:border-rpg-orange'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={goal.completed ? 'line-through' : ''}>{goal.title}</span>
                        <div className="flex gap-1">
                          {!goal.completed && (
                            <Button
                              size="sm"
                              className="bg-rpg-green hover:bg-rpg-green/80"
                              onClick={() => completeGoal(goal.id)}
                            >
                              <Icon name="Check" size={12} />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="hover:bg-red-500/20"
                            onClick={() => deleteGoal(goal.id)}
                          >
                            <Icon name="Trash2" size={12} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <Card className="bg-rpg-card border-rpg-border">
            <CardHeader>
              <CardTitle className="text-rpg-orange">Награды</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Icon name="Star" size={48} className="mx-auto mb-4 text-rpg-orange" />
                <h3 className="text-xl font-semibold mb-2">Система наград</h3>
                <p className="text-gray-400">Здесь будут отображаться ваши достижения и награды</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </div>
  )
}

export default Index